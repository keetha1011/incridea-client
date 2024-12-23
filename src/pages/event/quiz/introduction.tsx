import React, { useState } from "react";

const IntroductionPage = ({
  onNext,
  quizId,
}: {
  onNext: () => void;
  quizId: string;
}) => {
  const [Id] = useState(quizId);
  console.log(Id);

  return (
    <div className="max-w-full h-screen flex flex-col bg-primary-300">
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="bg-blend-lighten max-w-lg w-full md:w-3/4 lg:w-1/2 p-6  rounded-md">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white font-grotesk">
              Before You Begin
            </h2>
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

          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 font-grotesk">
              Overview
            </h2>
            <ul className="list-disc pl-6 mt-2 text-sm md:text-base text-secondary-100 font-sora">
              <li>Answer 15-20 timed, multiple-choice questions.</li>
              <li>~15 minutes duration.</li>
              <li>70th percentile required to pass and get a badge.</li>
              <li>Retry in 3 months if you don’t pass.</li>
            </ul>
          </div>

          <div className="mt-8 flex justify-end font-sora">
            <button
              onClick={onNext}
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
