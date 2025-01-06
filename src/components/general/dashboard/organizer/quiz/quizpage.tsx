"use client";

//need to add quiz has ended pop up and a timer

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperClass } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SubmitQuizAnswerDocument } from "~/generated/generated";
import { useMutation } from "@apollo/client";
import { Navigation } from "swiper/modules";
import {
  type Question,
  type Options,
} from "~/pages/event/[slug]/quiz/[quizId]";
// import Prism from "prismjs";
// import "prismjs/themes/prism-okaidia.css";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-java";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-c";
// import "prismjs/components/prism-cpp";
// import "prismjs/components/prism-markup";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCircleCaretLeft,
  IconCircleCaretRight,
  IconStopwatch,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import createToast from "~/components/toast";

const QuizPage = ({
  questions,
  name,
  description,
  startTime,
  endTime,
  quizId,
  teamId,
}: {
  questions: Question[];
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  quizId: string;
  teamId: number;
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Options[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [alert, setAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] =
    useState<string>(description);
  const [submitQuizAnswers, { loading: submitQuizLoading }] = useMutation(
    SubmitQuizAnswerDocument,
  );

  const router = useRouter();

  useEffect(() => {
    const savedData = sessionStorage.getItem(
      `selectionOptions-${teamId}-${quizId}`,
    );
    if (savedData) {
      const savedAnswers: Options[] = JSON.parse(savedData) as Options[];
      setSelectedAnswers(savedAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    hljs.highlightAll();
  }, [isReviewOpen]);

  useEffect(() => {
    hljs.highlightAll();
  }, [questions]);

  const onSubmit = async () => {
    console.log(selectedAnswers);
    const promise = submitQuizAnswers({
      variables: {
        quizId: quizId,
        selectedAnswers: selectedAnswers.map(({ id, questionId, value }) => ({
          id,
          questionId,
          value,
        })),
        teamId: teamId,
      },
    })
      .then((res) => {
        if (res.data?.submitQuiz.__typename === "MutationSubmitQuizSuccess") {
          sessionStorage.removeItem(`selectionOptions-${teamId}-${quizId}`);
          setIsReviewOpen(false);
          setIsDialogOpen(true);
          setTimeout(() => {
            setIsDialogOpen(false);
            router.push("/events").catch((error) => {
              console.error("Error navigating to event page:", error);
            });
          }, 3000);
        } else throw new Error("Error submitting quiz answers");
      })
      .catch((error) => {
        console.error("Error submitting quiz answers:", error);
      });

    await createToast(
      promise,
      "Submitting Quiz Answers",
      "Error submitting quiz answers",
    );
  };

  // const handleFinalSubmit = useCallback(() => {
  //   console.log(selectedAnswers);
  //   sessionStorage.removeItem("savedQuizData");
  //   onComplete();
  // }, [onComplete]);

  // useEffect(() => {
  //   if (quizFetchData?.getQuizById.__typename === "QueryGetQuizByIdSuccess") {
  //     const quizData = quizFetchData.getQuizById.data;
  //     if (quizData) {
  //       console.log(quizData);
  //       setQuizData(quizData);
  //       if (quizData.startTime && quizData.endTime) {
  //         setTimer((new Date(quizData.endTime).getTime() - Date.now()) / 1000);
  //       }
  //     }
  //   }
  // }, [quizFetchData]);
  useEffect(() => {
    if (!startTime || !endTime) return;

    const calculateTime = () =>
      (new Date(endTime).getTime() - Date.now()) / 1000;

    setTimer(calculateTime());
  }, [startTime, endTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = Math.max(prev - 1, 0);
        console.log("Before condition,", newTime);

        if (newTime <= 60) setAlert(true);
        if (newTime === 0) {
          clearInterval(interval);
          if (!submitted) {
            setSubmitted(true);
            setIsDialogOpen(true);
            onSubmit()
              .then(() => {
                console.log("Quiz submitted successfully");
              })
              .catch((error) => {
                console.error("Error submitting quiz answers:", error);
              });
            return 0;
          }
          console.log(newTime);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval); // wanna check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionSelect = (option: Options) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = prev.filter(
        (answer) => answer.questionId !== option.questionId,
      );
      updatedAnswers.push(option);
      sessionStorage.setItem(
        `selectionOptions-${teamId}-${quizId}`,
        JSON.stringify(updatedAnswers),
      );
      console.log(updatedAnswers);
      return updatedAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const formattedMinutes = String(m).padStart(2, "0");
    const formattedSeconds = String(s).padStart(2, "0");

    return h > 0
      ? `${String(h).padStart(2, "0")}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    console.log("Selected Answers", selectedAnswers);
  }, [selectedAnswers]);
  const progressPercentage = ((currentSlide + 1) / questions.length) * 100;

  const navigateToQuestion = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  const openReviewDialog = () => setIsReviewOpen(true);
  const closeReviewDialog = () => setIsReviewOpen(false);

  return (
    <div className="relative md:static w-[90%] mx-auto mt-16 flex flex-col justify-center md:flex-row bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Quiz Content */}
      <div className="flex flex-col w-full md:w-[70%] lg:w-3/4">
        {/* Header */}
        <header className="w-full sticky top-0 bg-gradient-to-br from-primary-400 to-primary-600  bg-opacity-70 backdrop-blur-lg shadow-md p-4 z-10 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white font-sora">
            {name}
          </h1>
          <div
            className={`px-4 py-2 rounded-lg flex items-center ${
              alert ? "bg-red-500 text-secondary-50 " : "bg-gray-50 text-black"
            }`}
          >
            <span className="mr-2">
              <IconStopwatch />
            </span>
            {formatTime(timer)}
          </div>
          <button
            className="md:hidden text-secondary-50 transition-all duration-200"
            onClick={() => {
              if (screen.width > 768) {
                setIsTrackerOpen(!isTrackerOpen);
                return;
              }
              setIsTrackerOpen(!isTrackerOpen);
            }}
          >
            {isTrackerOpen ? <IconCircleCaretLeft /> : <IconCircleCaretRight />}
          </button>
        </header>

        {/* Swiper */}
        <div className="relative mx-auto w-3/4 md:w-1/2 bg-gray-200 h-[1.25rem] mt-4 rounded-xl">
          <div
            className="bg-gradient-to-tr from-secondary-700 to-secondary-800 via-secondary-600 h-full rounded-xl transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <IconArrowRight
            className="absolute top-0 w-5 h-full text-secondary-50 transition-all duration-300"
            style={{ left: `calc(${progressPercentage}% - 20px)` }}
          />
        </div>
        <main className="flex-1 p-6">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".next-btn",
              prevEl: ".prev-btn",
            }}
            autoHeight={true}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            onSwiper={setSwiperInstance}
            spaceBetween={20}
            slidesPerView={1}
          >
            {/* {quizData.questions.map((question) => (
              <SwiperSlide key={question.id}>
                <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {question.mainQuestion}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        className={`p-4 rounded-lg shadow-lg text-left ${
                          selectedAnswers[question.id] === option.id
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-100 text-gray-700"
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
            ))} */}
            {questions.map((question) => (
              <SwiperSlide key={question.id}>
                <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    <span className="underline decoration-1 underline-offset-4">
                      Question:
                    </span>
                    {` ${question.question}`}
                  </h3>
                  {/* {question.description && (
                    <button
                      className="mb-4 text-transparent w-fit md:w-30 rounded-lg bg-clip-text bg-gradient-to-br from-secondary-600 to-primary-400 hover:bg-gradient-to-tr hover:from-secondary-300 hover:to-primary-300 hover:bg-clip-text hover:text-transparent hover:underline hover:decoration-4 hover:decoration-gradient-to-br"
                      onClick={() =>
                        question.description &&
                        setSelectedDescription(question.description)
                      }
                    >
                      {question.isCode ? (
                        <span>View Code</span>
                      ) : (
                        <span>View Description</span>
                      )}
                    </button>
                  )} */}

                  {question.image && (
                    <Image
                      src={question.image}
                      alt="Question image"
                      className="min-w-48 w-full max-w-96 h-60 object-cover rounded-lg mb-4"
                    />
                  )}

                  {question.description && question.isCode && (
                    <>
                      <h2 className="text-xl">Code:</h2>
                      <pre className="mb-6 text-lg">
                        <code className="">{`${question.description}`}</code>
                      </pre>
                    </>
                  )}
                  {question.description && !question.isCode && (
                    <>
                      <h2 className="text-xl">Question Description:</h2>
                      <p className="mb-6 text-lg">{`${question.description}`}</p>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        className={`p-4 rounded-lg shadow-lg text-left ${
                          Object.values(selectedAnswers).find(
                            (answer) => answer.questionId === question.id,
                          )?.id === option.id
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-10 flex justify-between p-4 bg-opacity-70 backdrop-blur-md">
            <button
              className={`prev-btn px-4 py-2 w-20 md:w-30  text-secondary-50 rounded-lg bg-gradient-to-br from-secondary-600 to-primary-400 hover:from-secondary-700 hover:to-primary-500 ${currentSlide === 0 && "opacity-0 cursor-default"}`}
            >
              <IconArrowLeft className="mx-auto" />
            </button>
            <button
              className={`next-btn px-4 py-2 text-secondary-50 w-20 md:w-30 rounded-lg  bg-gradient-to-br from-secondary-600 to-primary-400 hover:from-secondary-700 hover:to-primary-500 ${currentSlide === questions.length - 1 && "hidden"}`}
            >
              <IconArrowRight className="mx-auto" />
            </button>
          </div>
        </main>
      </div>
      {selectedDescription && !selectedAnswers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm md:text-base">
              {selectedDescription}
            </pre>
            <button
              className="mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-br from-secondary-700 to-primary-400 shadow-lg hover:from-secondary-700 hover:to-primary-500"
              onClick={() => setSelectedDescription("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Tracker */}
      <aside
        className={` lg:w-1/4 bg-white bg-opacity-70 backdrop-blur-md p-4 shadow-lg ${isTrackerOpen ? "absolute md:static z-50 top-20 right-0 w-3/4 sm:w-1/2 backdrop-blur-md" : "hidden md:w-3/4 md:block"}`}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quiz Navigator
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`p-2 rounded-full shadow-lg ${
                currentSlide === index
                  ? "bg-secondary-600 text-white"
                  : selectedAnswers.find(
                        (answer) => answer.questionId === questions[index]?.id,
                      )
                    ? "bg-green-700 text-white"
                    : "bg-gray-300"
              }`}
              onClick={() => navigateToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={openReviewDialog}
          className="mt-12 px-4 py-2 rounded-lg text-white bg-gradient-to-br from-secondary-700 to-primary-400 shadow-lg hover:from-secondary-700 hover:to-primary-500"
        >
          Review Quiz
        </button>
      </aside>
      {isReviewOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
          <h2 className="p-2 text-lg md:text-2xl xl:text-3xl font-extrabold bg-gradient-to-tl from-primary-200 via-secondary-500 to-secondary-500 bg-clip-text text-transparent mb-6 tracking-wide text-center">
            Take a Final Look at Your Answers!
            <span className="block text-sm md:text-lg font-semibold text-gray-100 mt-2">
              Double-check your responses before submitting the quiz for
              evaluation.
            </span>
          </h2>

          <div className="bg-glassy bg-opacity-60 p-4 md:p-6 w-3/4 md:w-1/2 h-[80%] overflow-y-auto rounded-3xl shadow-2xl bg-white">
            <div className="space-y-6 mb-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-3 rounded-lg shadow-md bg-white bg-opacity-90 relative"
                >
                  {/* Badge for Question Number */}
                  <span className="absolute top-3 left-2 text-xs md:text-sm font-bold text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 shadow-lg">
                    Q{index + 1}
                  </span>
                  <h3
                    className={`font-semibold text-gray-700 mb-4 pl-10 text-sm md:text-lg break-words ${index >= 9 && "mx-2"}`}
                  >
                    {question.question}
                  </h3>

                  {question.image && (
                    <Image
                      src={question.image}
                      alt="Question image"
                      className="min-w-48 w-full max-w-96 h-60 object-cover rounded-lg mb-4"
                    />
                  )}

                  {question.description && question.isCode && (
                    <>
                      <h2 className="text-xl">Code:</h2>
                      <pre className="mb-6 text-lg">
                        <code className="">{`${question.description}`}</code>
                      </pre>
                    </>
                  )}
                  {question.description && !question.isCode && (
                    <>
                      <h2 className="text-xl">Question Description:</h2>
                      <p className="mb-6 text-lg">{`${question.description}`}</p>
                    </>
                  )}

                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <p
                        key={option.id}
                        className={`px-4 py-2 rounded-lg shadow break-words ${
                          selectedAnswers.find(
                            (answer) => answer.questionId === question.id,
                          )?.id === option.id
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {option.value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={closeReviewDialog}
                className="w-3/4 md:w-auto px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-tr from-secondary-500 to-secondary-700 hover:from-secondary-600 hover:to-secondary-500 transition duration-200 shadow-md hover:shadow-lg"
              >
                Return to Quiz
              </button>
              <button
                onClick={onSubmit}
                disabled={submitQuizLoading}
                className="w-3/4 md:w-auto px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-tr from-primary-300 to-primary-200 hover:from-primary-400 hover:to-primary-300 transition duration-200 shadow-md hover:shadow-lg"
              >
                {submitQuizLoading ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50  mx-auto flex items-center justify-center backdrop-blur-sm">
          <div className="text-center w-[80%] md:w-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Quiz Submitted Successfully
            </h2>
            <p>You will be redirected to the event page shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;

{
  /* <div className="mt-4">
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
              (opt) => opt.id === selectedAnswers[question.id]
            )?.text
          : "Not Answered"}
      </p>
    </div>
  ))}
</div>
)} */
}
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
