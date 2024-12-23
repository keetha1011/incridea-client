import React, { useState } from "react";
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

const ResultsPage = ({ onNext }: { onNext: () => void }) => {
  const [progress] = useState(70);

  return (
    <div className="max-w-full h-screen flex flex-col bg-white">
      {/* Header Section with Progress Bar */}
      <div className="bg-blue-500 flex items-center justify-between p-6 text-white">
        <div className="flex items-center space-x-4">
          {/* Circular Progress Bar */}

          <h1 className="text-2xl md:text-3xl font-bold font-sora">
            Radiology Quiz Results
          </h1>
        </div>
        <div className="text-right">
          <div
            className="relative flex items-center justify-center"
            style={{ width: "70px", height: "70px" }}
          >
            {/* <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={{
                text: {
                  fill: '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                },
                path: {
                  stroke: '#4caf50', // Green color for progress
                  strokeLinecap: 'round',
                },
                trail: {
                  stroke: '#f1f1f1', // Light gray for the background
                },
              }}
            /> */}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-grow flex bg-gray-50 justify-center items-start p-6">
        <div className="bg-white max-w-3xl w-full md:w-2/3 lg:w-1/2 p-6 rounded-md shadow-lg">
          {/* Quiz Outcome Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 font-sora">
              Quiz Outcome
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 font-sora">
              You scored <span className="font-bold">{progress}%</span> in this
              quiz.
              {!progress && "Unfortunately, you did not pass the quiz."}
              {progress >= 60 && "Congratulations, you passed the quiz!"}
            </p>
          </div>

          {/* Detailed Stats Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 font-sora">
              Detailed Stats
            </h3>
            <div className="flex justify-between mt-4 text-sm md:text-base text-gray-600 font-sora">
              <span>Total Questions:</span>
              <span>20</span>
            </div>
            <div className="flex justify-between mt-4 text-sm md:text-base text-gray-600 font-sora">
              <span>Correct Answers:</span>
              <span>15</span>
            </div>
            <div className="flex justify-between mt-4 text-sm md:text-base text-gray-600 font-sora">
              <span>Incorrect Answers:</span>
              <span>5</span>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 font-sora">
              Next Steps
            </h3>
            <ul className="list-disc pl-6 mt-2 text-sm md:text-base text-gray-600 font-sora">
              {progress >= 60 ? (
                <>
                  <li>Download your certificate.</li>
                  <li>Explore more advanced courses in Radiology.</li>
                  <li>Check your overall progress on the dashboard.</li>
                </>
              ) : (
                <>
                  <li>Retry in 3 months.</li>
                  <li>Review the material for further study.</li>
                  <li>Consult with a mentor for additional guidance.</li>
                </>
              )}
            </ul>
          </div>

          {/* Start New Quiz Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              className="bg-blue-500 font-sora text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
