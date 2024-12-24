import React from "react";
import { useRouter } from "next/router";

const ResultsPage = () => {
  const router = useRouter(); // Hook for navigation

  return (
    <div className="mt-16 max-w-full h-screen flex flex-col bg-primary-200">
      {/* Header Section with Progress Bar */}
      <div className="bg-primary-500 flex items-center justify-center p-6 text-center text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl md:text-3xl font-bold font-sora">
            Thank you for taking the quiz!
          </h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mt-12 flex-grow flex bg-primary-200 justify-center items-start p-6">
        <div className="bg-primary-300 max-w-3xl w-full md:w-2/3 lg:w-1/2 p-6 rounded-md shadow-lg">
          {/* Quiz Outcome Section */}
          <div className="mb-6"></div>

          {/* Detailed Stats Section */}
          <div className="mb-6 tracking-wider text-center">
            <p className="text-xl font-semibold text-secondary-100 font-sora">
              Quiz completed — now let the suspense begin! <br />
              Results will be announced shortly.
            </p>
          </div>

          {/* Additional Information Section */}
          <div className="mt-6 text-center p-3">
            <p className="text-2xl font-semibold text-secondary-50 font-sora">
              In the meantime, why not explore other events?
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => router.push("/events")} // Navigate to /events
                className="bg-secondary-600 font-sora text-white px-6 py-2 rounded-md shadow-md hover:bg-secondary-700 focus:outline-none"
              >
                Explore events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
