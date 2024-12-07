import React from "react";
import { useEffect, useState } from "react";
import { generateUUID } from "three/src/math/MathUtils.js";
import Button from "~/components/button";
import Dashboard from "~/components/layout/dashboard";
import toast from "react-hot-toast";
import QuestionComp from "~/components/quiz/question";

// IMPORTANT NOTE: REMOVE LOCAL STORAGE FUNCTIONALITY TO FIX HYDRATION ERROR
// DUE TO LOCAL STORAGE HAVING DIFFERENT DATA THAN THE SERVER, WE ARE GETTING HYDRATION ERROR. BUT STILL THE PAGE IS WORKING FINE AS EXPECTED
// HOPEFULLY, THIS ERROR WON'T BE THERE IN THE FINAL IMPLEMENTATION
// IF IT IS, WE CAN REMOVE LOCAL STORAGE FUNCTIONALITY

type Question = {
  id: string;
  questionText: string;
  options: string[];
  ansIndex: number;
  answer: string;
  collapsed: boolean;
};

function saveToLocalStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function loadfromLocalStore<T>(key: string, fallback: T): T | null {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : fallback;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>(
    loadfromLocalStore<Question[]>("questions", [
      {
        id: generateUUID(),
        questionText: "",
        options: ["", ""],
        ansIndex: 0,
        answer: "",
        collapsed: false,
      },
    ]) ?? [],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      saveToLocalStore<Question[]>("questions", questions);
    }
  }, [questions]);

  const toggleCollapase = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, collapsed: !q.collapsed } : q)),
    );
  };

  const [quizTitle, setQuizTitle] = useState<string>(
    loadfromLocalStore<string>("quizTitle", "") ?? "",
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      saveToLocalStore<string>("quizTitle", quizTitle);
    }
  }, [quizTitle]);

  // const [errors, setErrors] = useState<string>("");

  const handleQuizTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(e.target.value);
  };

  const handleAddQuestions = (index: number) => {
    setQuestions((prev) => {
      const newQuestion = {
        id: generateUUID(),
        questionText: "",
        options: ["", ""],
        ansIndex: 0,
        answer: "",
        collapsed: false,
      };

      const updatedQuestions = [
        ...prev.map((q) => ({ ...q, collapsed: true })),
      ];
      updatedQuestions.splice(index + 1, 0, newQuestion);
      return updatedQuestions;
    });
  };

  const handleCopyQuestion = (id: string, index: number) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      setQuestions((prev) => {
        const newQuestion = {
          id: generateUUID(),
          questionText: question.questionText,
          options: question.options,
          ansIndex: question.ansIndex,
          answer: question.answer,
          collapsed: false,
        };

        const updatedQuestions = [
          ...prev.map((q) => ({ ...q, collapsed: true })),
        ];
        updatedQuestions.splice(index + 1, 0, newQuestion);
        return updatedQuestions;
      });
    }
  };

  const handleDeleteQuestions = (id: string) => {
    if (questions.length > 1) {
      setQuestions((prev) => {
        return prev.filter((q) => q.id !== id);
      });
    } else {
      toast.error("Quiz must have at least one question");
    }
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
      // setErrors(errors);
      console.log(questions, quizTitle);
      toast.error(errors);
    }
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
          <QuestionComp
            key={q.id}
            id={q.id}
            questionText={q.questionText}
            index={index}
            options={q.options}
            ansIndex={q.ansIndex}
            collapsed={q.collapsed}
            toggleCollapase={toggleCollapase}
            handleQuestionTextChange={handleQuestionTextChange}
            handleOptionChange={handleOptionChange}
            handleAnswerChange={handleAnswerChange}
            handleNewOption={handleNewOption}
            handleDeleteOption={handleDeleteOption}
            handleDeleteQuestions={handleDeleteQuestions}
            handleAddQuestions={handleAddQuestions}
            handleCopyQuestion={handleCopyQuestion}
          />
        ))}
      </div>
      <div className="flex mt-4 items-center justify-center">
        <Button
          className="my-4 rounded-md mr-6"
          intent={"success"}
          size={"large"}
          onClick={handlePrint}
        >
          Submit
        </Button>
      </div>
    </Dashboard>
  );
};

export default Quiz;
