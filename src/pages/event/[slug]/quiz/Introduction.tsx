import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetTeamDetailsDocument } from "~/generated/generated";
import { GetQuizByIdDocument } from "~/generated/generated";
import { VerifyQuizPasswordDocument } from "~/generated/generated";
import { useMutation } from "@apollo/client";
import { useAuth } from "~/hooks/useAuth"; // For testing purposes
import { Role } from "~/generated/generated"; // For testing purposes
import { BiLoader } from "react-icons/bi";

type Question = {
  id: string;
  question: string;
  options: Options[];
};

type Options = {
  id: string;
  value: string;
  questionId: string;
};

const IntroductionPage = ({
  setIsVerified,
  quizId,
  setQuestions,
  setMyTeamId,
}: {
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  quizId: string;
  setMyTeamId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const [Id] = useState(quizId);
  const { user, loading } = useAuth(); // For testing purposes
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasQuizStarted, setHasQuizStarted] = useState(false);
  const [hasQuizEnded, setHasQuizEnded] = useState(false);
  const [attended, setAttended] = useState(true);

  const handleQRScanner = () => {
    // Placeholder logic for QR scanner
    alert("QR Scanner functionality will be added soon!");
  };

  const [quizData, setQuizData] = useState<{
    __typename?: "Quiz";
    description?: string | null;
    endTime: Date;
    name: string;
    startTime: Date;
  } | null>(null);

  const { loading: loadingQuiz, data } = useQuery(GetQuizByIdDocument, {
    variables: { id: quizId },
  });

  console.log("Quiz data", data);

  const {
    data: myTeamData,
    error: teamError,
    loading: loadingTeam,
  } = useQuery(GetTeamDetailsDocument, {
    variables: {
      eventId:
        data?.getQuizById?.__typename === "QueryGetQuizByIdSuccess"
          ? data.getQuizById.data.eventId
          : "",
    },
  });

  const [verifyQuizPassword] = useMutation(VerifyQuizPasswordDocument);

  const handlePasswordSubmit = async () => {
    try {
      const { data } = await verifyQuizPassword({
        variables: { password: password, quizId: quizId },
      });
      if (
        data?.verifyQuizPassword.__typename ===
        "MutationVerifyQuizPasswordSuccess"
      ) {
        console.log(
          "Password verification data:",
          data.verifyQuizPassword.data.questions,
        );
        setQuestions(data.verifyQuizPassword.data.questions);
      }
      if (
        data &&
        data.verifyQuizPassword.__typename ===
          "MutationVerifyQuizPasswordSuccess"
      ) {
        setErrorMessage("");
        setIsVerified(true);
      } else {
        setErrorMessage("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  if (myTeamData?.myTeam?.__typename === "QueryMyTeamSuccess") {
    console.log(myTeamData.myTeam.data);
  }

  useEffect(() => {
    if (teamError) {
      console.error("Error fetching team details:", teamError);
      return;
    }
    if (myTeamData?.myTeam?.__typename === "QueryMyTeamSuccess") {
      setIsRegistered(true);
      setMyTeamId(parseInt(myTeamData.myTeam.data.id));
      setAttended(myTeamData.myTeam.data.attended);
    }
    if (user && user.role === Role.Organizer) {
      // For testing purposes
      setIsRegistered(true); // For testing purposes
    } // For testing purposes
    if (data?.getQuizById?.__typename === "QueryGetQuizByIdSuccess") {
      console.log(data.getQuizById.data);
      setQuizData(data.getQuizById.data);

      const currentTime = new Date();
      // const currentTimeUTC = new Date(currentTime.toISOString());

      const quizStartTime = new Date(data.getQuizById.data.startTime);
      const quizEndTime = new Date(data.getQuizById.data.endTime);

      if (currentTime >= quizStartTime && currentTime <= quizEndTime) {
        console.log("Quiz is ongoing");
        setHasQuizStarted(true);
      } else if (currentTime > quizEndTime) {
        console.log("Quiz has ended");
        setHasQuizEnded(true);
      } else {
        console.log("Quiz has not started");
      }
    } else {
      console.error("Error fetching quiz details:", data?.getQuizById?.message);
    }
  }, [data, myTeamData]);

  if (loadingQuiz || loadingTeam) {
    return (
      <div className="p-96">
        {/* <p>Loading...</p> */}
        <BiLoader className="animate-spin h-6 w-6 text-primary-500" />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="p-96">
        <p>Not Registered</p>
      </div>
    );
  }

  return (
    <div className="max-w-full h-screen flex flex-col  bg-primary-300">
      <div className="mt-auto md:mt-20 flex-grow flex flex-col justify-center items-center p-4">
        <h1 className="mb-6 text-2xl md:text-3xl font-semibold text-center text-white font-grotesk">
          {quizData?.name} Round 1 - Quiz
        </h1>
        <div className="bg-primary-500 max-w-lg w-full md:w-3/4 lg:w-1/2 p-6 rounded-md">
          <h2 className="text-lg md:text-xl font-semibold text-center text-white font-grotesk">
            You must require a password or scan a QR code to attempt the quiz.
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

            {/* QR Scanner */}
            <div className="mb-4">
              <p className="text-sm font-medium text-secondary-50 font-sora">
                Or use QR Scanner:
              </p>
              <button
                onClick={handleQRScanner}
                className="mt-2 w-full bg-secondary-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-secondary-600 focus:outline-none"
              >
                Open QR Scanner
              </button>
            </div>

            {/* Rules */}
            <p className="text-sm md:text-base text-primary-700 mt-2">
              Please note the following rules for the quiz:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm md:text-base text-secondary-50 font-sora">
              <li>The quiz must be completed in one attempt.</li>
              <li>A minimum score of 60% is required to pass.</li>
              <li>If you fail, no retest will be allowed.</li>
              <li>
                Students who pass will receive certification for this course.
              </li>
              <li>
                Avoid refreshing the page or changing tabs while taking the
                quiz.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex justify-center font-sora">
            {!attended ? (
              <div className="text-xl self-center text-white font-bold">
                <p>You have to be present at the venue to attempt the quiz</p>{" "}
              </div>
            ) : !isRegistered ? (
              <div className="text-xl self-center text-white font-bold">
                <p>Not Registered</p>
              </div>
            ) : (
              <>
                {hasQuizEnded ? (
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
                        className="bg-secondary-700 text-white px-4 md:px-6 py-2 rounded-md shadow-md hover:bg-secondary-600 focus:outline-none"
                      >
                        Start Quiz
                      </button>
                    )}
                  </>
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
