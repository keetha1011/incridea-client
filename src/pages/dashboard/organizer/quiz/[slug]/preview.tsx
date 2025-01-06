"use client";

//need to add quiz has ended pop up and a timer

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperClass } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GetQuizByIdDocument } from "~/generated/generated";
import { Navigation } from "swiper/modules";
import {
  type Question,
  type Options,
} from "~/pages/event/[slug]/quiz/[quizId]";
import { useQuery } from "@apollo/client";
import { EventByOrganizerDocument } from "~/generated/generated";
import Image from "next/image";
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
import { useRouter } from "next/router";
import { useAuth } from "~/hooks/useAuth";

const QuizPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { slug } = router.query;

  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");
  const [processedQuizScores, setProcessedQuizScores] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [quizName, setQuizName] = useState("");

  const { data } = useQuery(EventByOrganizerDocument, {
    variables: {
      organizerId: user?.id ?? "0",
    },
  });

  const event = data?.eventByOrganizer.find((event) => event.id === eventId);
  const round = event?.rounds.find((round) => round.roundNo === roundInt);
  const quizId = round?.quiz?.id;

  const { data: quizScores } = useQuery(GetQuizByIdDocument, {
    variables: { id: quizId ?? "" },
    skip: !quizId,
  });

  useEffect(() => {
    if (
      quizScores?.getQuizById.__typename === "QueryGetQuizByIdSuccess" &&
      !processedQuizScores
    ) {
      const qs = quizScores.getQuizById.data;
      const mappedqs = qs.questions.map((question) => ({
        id: question.id,
        question: question.question,
        image: question.image,
        options: question.options,
        isCode: question.isCode,
        description: question.description,
      }));

      setQuizName(qs.name);

      setQuestions(mappedqs);
      setProcessedQuizScores(true);
    }
  }, [quizScores, processedQuizScores]);

  const [selectedAnswers, setSelectedAnswers] = useState<Options[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  useEffect(() => {
    const savedData = sessionStorage.getItem(
      `selectionOptions-${user?.id}-${quizId}`,
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

  const handleOptionSelect = (option: Options) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = prev.filter(
        (answer) => answer.questionId !== option.questionId,
      );
      updatedAnswers.push(option);
      sessionStorage.setItem(
        `selectionOptions-${user?.id}-${quizId}`,
        JSON.stringify(updatedAnswers),
      );
      console.log(updatedAnswers);
      return updatedAnswers;
    });
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
      <div className="flex flex-col w-full md:w-[70%] lg:w-3/4">
        <header className="w-full sticky top-0 bg-gradient-to-br from-primary-400 to-primary-600  bg-opacity-70 backdrop-blur-lg shadow-md p-4 z-10 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white font-sora">
            {quizName}
          </h1>
          <div>
            <span className="mr-2 flex text-white gap-1">
              <IconStopwatch />
              {"00:00"}
            </span>
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
            {questions.map((question) => (
              <SwiperSlide key={question.id}>
                <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    <span className="underline decoration-1 underline-offset-4">
                      Question:
                    </span>
                    {` ${question.question}`}
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

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={closeReviewDialog}
                className="w-3/4 md:w-auto px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-tr from-secondary-500 to-secondary-700 hover:from-secondary-600 hover:to-secondary-500 transition duration-200 shadow-md hover:shadow-lg"
              >
                Return to Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
