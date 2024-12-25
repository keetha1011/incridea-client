import React, { useState } from "react";

const IntroductionPage = ({
  onNext,
  quizId,
}: {
  onNext: () => void;
  quizId: string;
}) => {
  // const [Id] = useState(quizId);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordSubmit = () => {
    if (password === "12345") {
      // Replace "12345" with your actual password logic
      setErrorMessage("");
      onNext();
    } else {
      setErrorMessage("Invalid password. Please try again.");
    }
  };

  const handleQRScanner = () => {
    // Placeholder logic for QR scanner
    alert("QR Scanner functionality will be added soon!");
  };

  return (
    <div className="max-w-full h-screen flex flex-col  bg-primary-300">
      <div className="mt-auto md:mt-20 flex-grow flex flex-col justify-center items-center p-4">
        <h1 className="mb-6 text-2xl md:text-3xl font-semibold text-center text-white font-grotesk">
          (Event Name) Round 1 - Quiz
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

          {/* Start Quiz */}
          <div className="mt-8 flex justify-end font-sora">
            <button
              onClick={handlePasswordSubmit}
              className="bg-secondary-700 text-white px-4 md:px-6 py-2 rounded-md shadow-md hover:bg-secondary-600 focus:outline-none"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
