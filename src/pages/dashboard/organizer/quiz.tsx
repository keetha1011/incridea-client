import React from "react";
import { useState } from "react";
import { CiCirclePlus, CiImageOn } from "react-icons/ci";
import { HiOutlineDuplicate } from "react-icons/hi";
import { ImRadioUnchecked } from "react-icons/im";
import { MdDeleteOutline } from "react-icons/md";
import { generateUUID } from "three/src/math/MathUtils.js";
import Button from "~/components/button";
import Dashboard from "~/components/layout/dashboard";
import { options } from "prettier-plugin-tailwindcss";
import toast from "react-hot-toast";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  ansIndex: number;
  answer: string;
}

const Quiz = () => {
  // const [countOptions, setCountOptions] = useState(2);
  // const [countQuestions, setCountQuestions] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateUUID(),
      questionText: "",
      options: ["", ""],
      ansIndex: 0,
      answer: "",
    },
  ]);

  const [quizTitle, setQuizTitle] = useState<string>("");

  const [errors, setErrors] = useState<string>("");

  const handleQuizTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(e.target.value);
  };

  const handleAddQuestions = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: generateUUID(),
        questionText: "",
        options: ["", ""],
        ansIndex: 0,
        answer: "",
      },
    ]);
  };

  const handleDeleteQuestions = (id: string) => {
    setQuestions((prev) => {
      return prev.filter((q) => q.id !== id);
    });
  };

  const handleQuestionTextChange = (id: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, questionText: value } : q)),
    );
  };

  const handleOptionChange = (
    id: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt,
              ),
              answer: q.ansIndex === optionIndex ? value : q.answer,
            }
          : q,
      ),
    );
  };

  const handleAnswerChange = (
    id: string,
    optIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log("Answer Changed: ", e.target.name);
    console.log("Answer Id: ", e.target.id);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, ansIndex: optIndex, answer: q.options[optIndex] ?? "" }
          : q,
      ),
    );
    console.log("Answer Changed: ", questions);
  };

  const handleNewOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  };

  const handleDeleteOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && q.options.length > 2
          ? { ...q, options: q.options.slice(0, -1) }
          : q,
      ),
    );
  };

  const validateQuiz = () => {
    if (quizTitle === "") {
      return "Quiz Title cannot be empty";
    } else if (questions.length === 0) {
      return "Quiz must have at least one question";
    } else {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i]?.questionText === "") {
          return `Question ${i + 1} cannot be empty`;
        } else if ((questions[i]?.options?.length ?? 0) < 2) {
          return `Question ${i + 1} must have at least 2 options`;
        } else if (questions[i]?.answer === "") {
          return `Question ${i + 1} must have an answer`;
        } else {
          for (let j = 0; j < (questions[i]?.options?.length ?? 0); j++) {
            if (questions[i]?.options[j] === "") {
              return `Question ${i + 1} option ${j + 1} cannot be empty`;
            }
          }
        }
      }
    }
  };

  const handlePrint = () => {
    const errors = validateQuiz();
    if (!errors) {
      console.log("Quiz Submitted:", { quizTitle, questions });
      console.log("success");
      toast.success("Quiz Submitted Successfully");
    } else {
      setErrors(errors);
      console.log(questions, quizTitle);
      toast.error(errors);
    }

    // toast.error("Not implemented yet");
  };

  return (
    <Dashboard>
      <div className="mx-4 flex flex-row align-middle gap-4">
        <label className="self-center font-gilroy text-xl" htmlFor="quizTitle">
          Quiz Title:
        </label>
        <input
          className=" self-center w-60 rounded-2xl bg-gray-900/80 bg-opacity-30 bg-clip-padding p-2 px-4 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
          placeholder="Enter quiz title"
          id="quizTitle"
          value={quizTitle}
          onChange={(e) => handleQuizTitleChange(e)}
        />
      </div>
      <div className="flex flex-col min-h-fit">
        {questions.map((q, index) => (
          <div key={q.id} className="flex py-8">
            <div className="flex h-auto w-full flex-col items-start rounded-3xl bg-gray-900/80 p-4 px-8">
              <h1 className="mt-4 font-gilroy text-xl font-medium">
                Question {index + 1}
              </h1>
              <div className="flex w-full flex-row items-center">
                <input
                  className="mt-4 h-16 w-[1000px] rounded-3xl bg-slate-600 bg-opacity-20 bg-clip-padding px-4 outline-none backdrop-blur-3xl backdrop-filter"
                  type="text"
                  placeholder="Enter Question"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(q.id, e.target.value)
                  }
                ></input>
                {/* <CiImageOn className="mx-8 text-3xl" /> */}
                {/* <select
                name="type"
                className="block rounded-lg border-0 border-gray-900 bg-slate-700 bg-opacity-60 bg-clip-padding px-8 py-2 text-sm text-white placeholder-gray-800 ring-gray-500 backdrop-blur-3xl backdrop-filter focus:outline-none focus:ring-2"
                id=""
              >
                <option value="MCQ">MCQ</option>
                <option value="MMCQ">MMCQ</option>
                <option value="FITB">FITB</option>
              </select> */}
              </div>
              {q.options.map((opt, index2) => (
                <div
                  key={index2}
                  className="mt-4 flex flex-row items-center justify-center gap-3"
                >
                  <div className="flex flex-row items-center justify-center gap-4">
                    <ImRadioUnchecked className="text-lg" />
                    <input
                      className="mr-4 w-full rounded-2xl bg-slate-600 bg-opacity-30 bg-clip-padding p-2 px-4 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
                      placeholder={`Enter option ${index2 + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(q.id, index2, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      required
                      id={`answer-${q.id}-${index2 + 1}`}
                      type="radio"
                      value={opt}
                      name={`ans-${q.id}`}
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      checked={q.ansIndex === index2}
                      onChange={(e) => handleAnswerChange(q.id, index2, e)}
                    />
                    <label
                      htmlFor={`answer-${q.id}-${index2 + 1}`}
                      className="w-full py-4 text-lg font-semibold dark:text-gray-300"
                    >
                      Is Answer?
                    </label>
                    {/* text-gray-900 */}
                  </div>
                </div>
              ))}

              {/* <CiImageOn className="mx-8 cursor-pointer text-3xl" /> */}

              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row">
                  <Button
                    className="my-4 rounded-md mr-6"
                    intent={"ghost"}
                    size={"small"}
                    onClick={() => handleNewOption(q.id)}
                  >
                    Add Option
                  </Button>
                  <Button
                    className="my-4 rounded-md -skew-x-12"
                    intent={"danger"}
                    size={"small"}
                    onClick={() => handleDeleteOption(q.id)}
                  >
                    Delete Option
                  </Button>
                </div>

                <div className="flex w-40 flex-row items-center justify-around rounded-2xl">
                  <CiCirclePlus
                    className="text-3xl hover:rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={handleAddQuestions}
                  />
                  <HiOutlineDuplicate
                    className="text-3xl hover:rounded-lg hover:bg-slate-800"
                    onClick={handlePrint}
                  />
                  <MdDeleteOutline
                    className="text-3xl hover:rounded-lg hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleDeleteQuestions(q.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
};

export default Quiz;
