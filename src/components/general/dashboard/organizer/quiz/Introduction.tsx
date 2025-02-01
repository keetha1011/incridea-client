import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  AttemptQuizDocument,
  GetQuizByIdDocument,
  VerifyQuizPasswordDocument,
} from "~/generated/generated";
import { BiLoader } from "react-icons/bi";
import { type Question } from "~/pages/event/[slug]/quiz/[quizId]";

const IntroductionPage = ({
  setIsVerified,
  quizId,
  setName,
  setDescription,
  setStartTime,
  setEndTime,
  setMyTeamId,
}: {
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setStartTime: React.Dispatch<React.SetStateAction<Date>>;
  setEndTime: React.Dispatch<React.SetStateAction<Date>>;
  quizId: string;
  setMyTeamId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teamId, setTeamId] = useState(0);
  const [hasQuizStarted, setHasQuizStarted] = useState(false);
  const [hasQuizEnded, setHasQuizEnded] = useState(false);
  const [attended, setAttended] = useState(true);

  const [quizData, setQuizData] = useState<{
    __typename?: "Quiz";
    description?: string | null;
    endTime: Date;
    name: string;
    startTime: Date;
  } | null>(null);

  const { loading: attemptQuizLoading, data: attemptQuizData } = useQuery(
    AttemptQuizDocument,
    {
      variables: { quizId: quizId },
    },
  );

  const { loading: quizLoading, data: quiz } = useQuery(GetQuizByIdDocument, {
    variables: { id: quizId },
    skip: !attemptQuizData,
  });

  const [verifyQuizPassword, { loading: verifyQuizLoading }] = useLazyQuery(
    VerifyQuizPasswordDocument,
  );

  const handlePasswordSubmit = async () => {
    try {
      const { data } = await verifyQuizPassword({
        variables: { password: password, quizId: quizId },
      });
      if (
        data?.verifyQuizPassword.__typename === "QueryVerifyQuizPasswordSuccess"
      ) {
        setErrorMessage("");
        setIsVerified(true);
        localStorage.setItem("quizStartTime", new Date().toISOString());
      } else {
        setErrorMessage("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setPassword("");
    }
  };

  useEffect(() => {
    if (attemptQuizData?.attemptQuiz.__typename === "QueryAttemptQuizSuccess") {
      const teamId = attemptQuizData.attemptQuiz.data.id;
      setTeamId(parseInt(teamId));
      setMyTeamId(parseInt(teamId));
      setAttended(attemptQuizData.attemptQuiz.data.attended);
    }

    if (quiz?.getQuizById.__typename === "QueryGetQuizByIdSuccess") {
      setQuizData(quiz.getQuizById.data);
      setStartTime(new Date(quiz.getQuizById.data.startTime));
      setEndTime(new Date(quiz.getQuizById.data.endTime));
      setName(quiz.getQuizById.data.name);
      if (quiz.getQuizById.data.description)
        setDescription(quiz.getQuizById.data.description);
      const currentTime = new Date();
      const quizStartTime = new Date(quiz.getQuizById.data.startTime);
      const quizEndTime = new Date(quiz.getQuizById.data.endTime);
      if (currentTime >= quizStartTime && currentTime <= quizEndTime)
        setHasQuizStarted(true);
      else if (currentTime > quizEndTime) setHasQuizEnded(true);
      if (localStorage.getItem(`selectionOptions-${teamId}-${quizId}`) !== null)
        setIsVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptQuizData, quiz]);

  if (attemptQuizLoading || quizLoading) {
    return (
      <div className="w-full h-screen grid justify-center items-center text-3xl">
        {/* <p>Loading...</p> */}
        <BiLoader
          size={100}
          className="animate-spin h-6 w-6 text-primary-500"
        />
      </div>
    );
  }

  if (attemptQuizData?.attemptQuiz.__typename === "Error") {
    return (
      <div className="w-full h-screen grid justify-center items-center text-3xl">
        <p>{attemptQuizData.attemptQuiz.message}</p>
      </div>
    );
  }

  if (quiz?.getQuizById.__typename === "Error") {
    return (
      <div className="w-full h-screen grid justify-center items-center text-3xl">
        <p>{quiz.getQuizById.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full h-screen flex flex-col  bg-primary-300">
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <h1 className="mb-6 text-2xl md:text-3xl font-semibold text-center text-white font-grotesk">
          {quizData?.name}
        </h1>
        <div className="bg-primary-500 max-w-lg w-full md:w-3/4 lg:w-1/2 p-6 rounded-md">
          <h2 className="text-lg md:text-xl font-semibold text-center text-white font-grotesk">
            You must enter the password to attempt the quiz.
          </h2>

          <div className="mt-6">
            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-50 font-sora"
              >
                Enter Password:
              </label>
              <input
                type="password"
                id="password"
                disabled={hasQuizEnded || !hasQuizStarted || !attended}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-700"
                placeholder="Enter your password"
              />
              {errorMessage && (
                <p className="mt-2 text-sm text-red-500 font-sora">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Rules */}
            <p className="text-sm md:text-base text-primary-700 mt-2">
              Please note the following rules for the quiz:
            </p>
            <article className="pl-6 mt-2 text-sm md:text-base text-secondary-50 font-sora">
              {quizData?.description}
            </article>
          </div>

          <div className="mt-8 flex justify-center font-sora">
            {!attended ? (
              <div className="text-xl self-center text-white font-bold">
                <p>You have to be present at the venue to attempt the quiz</p>{" "}
              </div>
            ) : hasQuizEnded ? (
              <div className="text-xl self-center text-white font-bold">
                <p>Quiz has ended</p>
              </div>
            ) : (
              <>
                {!hasQuizStarted ? (
                  <div className="text-xl self-center text-white font-bold">
                    <p>Quiz has not yet started</p>
                  </div>
                ) : (
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={verifyQuizLoading || !password}
                    className="bg-secondary-700 text-white px-4 md:px-6 py-2 rounded-md shadow-md hover:bg-secondary-600 focus:outline-none disabled:bg-secondary-400"
                  >
                    {verifyQuizLoading ? (
                      <BiLoader className="animate-spin h-6 w-6" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
