"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

import { IconClock } from "@tabler/icons-react";

type Question = {
  id: number;
  mainQuestion: string;
  correctAnswerId: number;
  options: { id: number; text: string }[];
};

const quizData = {
  title: "Quiz Title",
  timings: "10",
  questions: [
    {
      id: 1,
      mainQuestion: "What is the capital of France?",
      correctAnswerId: 3,
      options: [
        { id: 1, text: "Berlin" },
        { id: 2, text: "Madrid" },
        { id: 3, text: "Paris" },
        { id: 4, text: "Rome" },
      ],
    },
    {
      id: 2,
      mainQuestion: "Which planet is known as the Red Planet?",
      correctAnswerId: 2,
      options: [
        { id: 1, text: "Venus" },
        { id: 2, text: "Mars" },
        { id: 3, text: "Jupiter" },
        { id: 4, text: "Saturn" },
      ],
    },
    {
      id: 3,
      mainQuestion: "Who wrote 'Hamlet'?",
      correctAnswerId: 1,
      options: [
        { id: 1, text: "William Shakespeare" },
        { id: 2, text: "Charles Dickens" },
        { id: 3, text: "J.K. Rowling" },
        { id: 4, text: "Mark Twain" },
      ],
    },
    {
      id: 4,
      mainQuestion: "What is the chemical symbol for water?",
      correctAnswerId: 4,
      options: [
        { id: 1, text: "O2" },
        { id: 2, text: "CO2" },
        { id: 3, text: "H" },
        { id: 4, text: "H2O" },
      ],
    },
    {
      id: 5,
      mainQuestion: "Which country is known as the Land of the Rising Sun?",
      correctAnswerId: 3,
      options: [
        { id: 1, text: "China" },
        { id: 2, text: "Thailand" },
        { id: 3, text: "Japan" },
        { id: 4, text: "India" },
      ],
    },
    {
      id: 6,
      mainQuestion: "Which element has the atomic number 1?",
      correctAnswerId: 1,
      options: [
        { id: 1, text: "Hydrogen" },
        { id: 2, text: "Helium" },
        { id: 3, text: "Oxygen" },
        { id: 4, text: "Carbon" },
      ],
    },
    {
      id: 7,
      mainQuestion: "Which is the largest mammal?",
      correctAnswerId: 4,
      options: [
        { id: 1, text: "Elephant" },
        { id: 2, text: "Giraffe" },
        { id: 3, text: "Rhino" },
        { id: 4, text: "Blue Whale" },
      ],
    },
    {
      id: 8,
      mainQuestion: "What is the smallest prime number?",
      correctAnswerId: 2,
      options: [
        { id: 1, text: "0" },
        { id: 2, text: "2" },
        { id: 3, text: "3" },
        { id: 4, text: "1" },
      ],
    },
    {
      id: 9,
      mainQuestion: "Who painted the Mona Lisa?",
      correctAnswerId: 3,
      options: [
        { id: 1, text: "Vincent van Gogh" },
        { id: 2, text: "Pablo Picasso" },
        { id: 3, text: "Leonardo da Vinci" },
        { id: 4, text: "Claude Monet" },
      ],
    },
    {
      id: 10,
      mainQuestion: "Which language is primarily spoken in Brazil?",
      correctAnswerId: 1,
      options: [
        { id: 1, text: "Portuguese" },
        { id: 2, text: "Spanish" },
        { id: 3, text: "French" },
        { id: 4, text: "English" },
      ],
    },
    {
      id: 11,
      mainQuestion: "Which is the fastest land animal?",
      correctAnswerId: 2,
      options: [
        { id: 1, text: "Lion" },
        { id: 2, text: "Cheetah" },
        { id: 3, text: "Tiger" },
        { id: 4, text: "Leopard" },
      ],
    },
    {
      id: 12,
      mainQuestion: "What is the largest planet in our Solar System?",
      correctAnswerId: 3,
      options: [
        { id: 1, text: "Earth" },
        { id: 2, text: "Venus" },
        { id: 3, text: "Jupiter" },
        { id: 4, text: "Saturn" },
      ],
    },
  ] as Question[],
};

const QuizPage = ({ onComplete }: { onComplete: () => void }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timer, setTimer] = useState<number>(parseInt(quizData.timings) * 60);
  const [alert, setAlert] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [score, setScore] = useState(0);

  const handleFinalSubmit = useCallback(() => {
    let score = 0;
    quizData.questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      if (selectedAnswerId === question.correctAnswerId) {
        score += 1;
      }
    });
    setScore(score);
    sessionStorage.removeItem("savedQuizData");
    onComplete();
  }, [selectedAnswers, onComplete]);

  useEffect(() => {
    const savedQuizData = sessionStorage.getItem("savedQuizData");
    if (savedQuizData) {
      setSelectedAnswers(JSON.parse(savedQuizData) as Record<number, number>);
    }

    const storedTimer = sessionStorage.getItem("timer");
    if (storedTimer) {
      setTimer(Number(storedTimer));
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = Math.max(prev - 1, 0);
        sessionStorage.setItem("timer", String(newTime));
        if (newTime <= 30) {
          setAlert(true);
        }
        if (newTime === 0) {
          sessionStorage.removeItem("timer");
          handleFinalSubmit();
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleFinalSubmit]);

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: optionId };
      sessionStorage.setItem("savedQuizData", JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Side: Quiz Content */}
      <div className="flex flex-col w-full lg:w-3/4">
        {/* Header */}
        <div className="sticky top-0 bg-blue-500 text-white w-full z-10 shadow-md p-4">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex-1 text-left">
              <h2 className="text-xl md:text-2xl font-bold">
                {quizData.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <p
                className={`p-2 gap-2 rounded-md flex items-center ${
                  alert ? "bg-red-500" : "bg-gray-700"
                }`}
              >
                <IconClock size={24} />
                {formatTime(timer)}
              </p>
            </div>
          </div>
        </div>

        {/* Swiper Component */}
        <div className="flex-1 bg-gray-100 h-screen overflow-y-auto p-6 shadow-lg rounded-md mb-4 lg:mb-0">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".next-btn",
              prevEl: ".prev-btn",
            }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {quizData.questions.map((question) => (
              <SwiperSlide key={question.id}>
                <div className="p-6 bg-white shadow-md rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {question.mainQuestion}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        className={`w-full text-left px-4 py-2 rounded-lg border ${
                          selectedAnswers[question.id] === option.id
                            ? "bg-green-200 border-green-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        onClick={() =>
                          handleOptionSelect(question.id, option.id)
                        }
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button className="prev-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Previous
            </button>
            <button className="next-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Question Tracker & Review Mode */}
      <div className="w-full lg:w-1/4 bg-white p-4 shadow-md">
        <h3 className="text-lg font-bold mb-4">Question Tracker</h3>
        <div className="grid grid-cols-4 gap-2">
          {quizData.questions.map((question) => (
            <button
              key={question.id}
              className={`p-2 rounded-md border ${
                selectedAnswers[question.id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {question.id}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <button
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handleFinalSubmit}
          >
            Submit Quiz
          </button>
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
            onClick={() => setIsReviewOpen(!isReviewOpen)}
          >
            {isReviewOpen ? "Exit Review" : "Review Answers"}
          </button>
        </div>
        {isReviewOpen && (
          <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-inner">
            <h4 className="font-bold text-lg mb-2">Review Mode</h4>
            {quizData.questions.map((question) => (
              <div key={question.id} className="mb-4">
                <p className="font-medium">{question.mainQuestion}</p>
                <p className="text-sm text-gray-600">
                  Selected:{" "}
                  {selectedAnswers[question.id]
                    ? question.options.find(
                        (opt) => opt.id === selectedAnswers[question.id],
                      )?.text
                    : "Not Answered"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

// const quizData = {
//   title: "Quiz Title",
//   timings: "10",
//   questions: [
//     {
//       id: 1,
//       mainQuestion: "What is the capital of France?",
//       correctAnswerId: 3,
//       options: [
//         { id: 1, text: "Berlin" },
//         { id: 2, text: "Madrid" },
//         { id: 3, text: "Paris" },
//         { id: 4, text: "Rome" },
//       ],
//     },
//     {
//       id: 2,
//       mainQuestion: "Which planet is known as the Red Planet?",
//       correctAnswerId: 2,
//       options: [
//         { id: 1, text: "Venus" },
//         { id: 2, text: "Mars" },
//         { id: 3, text: "Jupiter" },
//         { id: 4, text: "Saturn" },
//       ],
//     },
//     {
//       id: 3,
//       mainQuestion: "Who wrote 'Hamlet'?",
//       correctAnswerId: 1,
//       options: [
//         { id: 1, text: "William Shakespeare" },
//         { id: 2, text: "Charles Dickens" },
//         { id: 3, text: "J.K. Rowling" },
//         { id: 4, text: "Mark Twain" },
//       ],
//     },
//     {
//       id: 4,
//       mainQuestion: "What is the chemical symbol for water?",
//       correctAnswerId: 4,
//       options: [
//         { id: 1, text: "O2" },
//         { id: 2, text: "CO2" },
//         { id: 3, text: "H" },
//         { id: 4, text: "H2O" },
//       ],
//     },
//     {
//       id: 5,
//       mainQuestion: "Which country is known as the Land of the Rising Sun?",
//       correctAnswerId: 3,
//       options: [
//         { id: 1, text: "China" },
//         { id: 2, text: "Thailand" },
//         { id: 3, text: "Japan" },
//         { id: 4, text: "India" },
//       ],
//     },
//     {
//       id: 6,
//       mainQuestion: "Which element has the atomic number 1?",
//       correctAnswerId: 1,
//       options: [
//         { id: 1, text: "Hydrogen" },
//         { id: 2, text: "Helium" },
//         { id: 3, text: "Oxygen" },
//         { id: 4, text: "Carbon" },
//       ],
//     },
//     {
//       id: 7,
//       mainQuestion: "Which is the largest mammal?",
//       correctAnswerId: 4,
//       options: [
//         { id: 1, text: "Elephant" },
//         { id: 2, text: "Giraffe" },
//         { id: 3, text: "Rhino" },
//         { id: 4, text: "Blue Whale" },
//       ],
//     },
//     {
//       id: 8,
//       mainQuestion: "What is the smallest prime number?",
//       correctAnswerId: 2,
//       options: [
//         { id: 1, text: "0" },
//         { id: 2, text: "2" },
//         { id: 3, text: "3" },
//         { id: 4, text: "1" },
//       ],
//     },
//     {
//       id: 9,
//       mainQuestion: "Who painted the Mona Lisa?",
//       correctAnswerId: 3,
//       options: [
//         { id: 1, text: "Vincent van Gogh" },
//         { id: 2, text: "Pablo Picasso" },
//         { id: 3, text: "Leonardo da Vinci" },
//         { id: 4, text: "Claude Monet" },
//       ],
//     },
//     {
//       id: 10,
//       mainQuestion: "Which language is primarily spoken in Brazil?",
//       correctAnswerId: 1,
//       options: [
//         { id: 1, text: "Portuguese" },
//         { id: 2, text: "Spanish" },
//         { id: 3, text: "French" },
//         { id: 4, text: "English" },
//       ],
//     },
//     {
//       id: 11,
//       mainQuestion: "Which is the fastest land animal?",
//       correctAnswerId: 2,
//       options: [
//         { id: 1, text: "Lion" },
//         { id: 2, text: "Cheetah" },
//         { id: 3, text: "Tiger" },
//         { id: 4, text: "Leopard" },
//       ],
//     },
//     {
//       id: 12,
//       mainQuestion: "What is the largest planet in our Solar System?",
//       correctAnswerId: 3,
//       options: [
//         { id: 1, text: "Earth" },
//         { id: 2, text: "Venus" },
//         { id: 3, text: "Jupiter" },
//         { id: 4, text: "Saturn" },
//       ],
//     },
//   ] as Question[],
// };
