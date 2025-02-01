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
        <p>Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#003d1c] via-[#002e1c]] to-[#004e2c] flex flex-col justify-evenly items-center p-4">
      <h2 className="w-fit mx-auto text-3xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 via-yellow-400 text-transparent bg-clip-text drop-shadow-md">
        {quizData?.name}
      </h2>

      <div className="lg:w-1/2 mx-auto bg-amber-200/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
        {" "}
        <div className="p-6 text-center">
          <div className="bg-white/10 rounded-xl p-6 mt-4">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">
              Password Required
            </h2>

            {/* Password Input */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[1rem] text-white/80 mb-2"
                >
                  Enter Quiz Password:
                </label>
                <input
                  type="password"
                  id="password"
                  disabled={hasQuizEnded || !hasQuizStarted || !attended}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-3/4 mx-auto px-4 py-2 bg-white/20 backdrop-blur-sm text-white 
                  border border-white/30 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  placeholder-white/50"
                  placeholder="Enter your password"
                />
                {errorMessage && (
                  <p className="mt-2 text-sm font-medium text-red-300">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Rules Section */}
              <div className="bg-white/10 rounded-md p-4 mt-4">
                <p className="w-fit mx-auto text-lg font-semibold text-amber-300 border-b-[1px] border-amber-400 mb-2">
                  Quiz Rules:
                </p>
                <p className="text-[1rem] text-pretty text-gray-100">
                  {quizData?.description}
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-6">
              {!attended ? (
                <div className="text-center text-white font-medium">
                  You must be present at the venue to attempt the quiz
                </div>
              ) : hasQuizEnded ? (
                <div className="text-center text-white font-medium">
                  Quiz has ended
                </div>
              ) : (
                <>
                  {!hasQuizStarted ? (
                    <div className="text-center text-white font-medium">
                      Quiz has not yet started
                    </div>
                  ) : (
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={verifyQuizLoading || !password}
                      className="mt-6 rounded-full w-3/4 lg:w-1/2 mx-auto bg-amber-500 text-white py-2
                hover:bg-amber-600 transition-colors duration-300
                disabled:bg-slate-400 disabled:cursor-not-allowed
                flex justify-center items-center"
                    >
                      {verifyQuizLoading ? (
                        <BiLoader className="animate-spin h-6 w-6" />
                      ) : (
                        "Submit Password"
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
