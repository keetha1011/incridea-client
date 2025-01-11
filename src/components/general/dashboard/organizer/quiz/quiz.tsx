import React from "react";
import { useEffect, useState } from "react";
import { generateUUID } from "three/src/math/MathUtils.js";
import Button from "~/components/button";
import toast from "react-hot-toast";
import QuestionComp from "~/components/general/dashboard/organizer/quiz/question";
import { type EventByOrganizerQuery } from "~/generated/generated";
import { UpdateQuizDocument } from "~/generated/generated";
import { useMutation, useQuery } from "@apollo/client";
import { BiLoaderAlt } from "react-icons/bi";
import { Save } from "lucide-react";
import { GetQuizByEventRoundDocument } from "~/generated/generated";

// BELOW 4 lines of COMMENTS ARE KINDA NOT USEFUL BECAUSE HYDRATION ERROR HAS BEEN FIXED
// BUT STILL KEEPING IT FOR REFERENCE

// NOTE: REMOVE LOCAL STORAGE FUNCTIONALITY TO FIX HYDRATION ERROR
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
  isCode: boolean;
  description: string;
  imageUrl: string;
  mode: "view" | "edit" | "new" | "delete";
  createdAt: string;
};

type QuizDetailsType = {
  quizTitle: string;
  description: string;
  startTime: string;
  endTime: string;
  password: string;
};

// function appendMilliseconds(localDateString: string): string {
//   return `${localDateString}:00.000Z`;
// }

function saveToLocalStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function loadfromLocalStore<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value) as T;
  else {
    saveToLocalStore<T>(key, [] as T);
    return null;
  }
}

const Quiz: React.FC<{
  event: EventByOrganizerQuery["eventByOrganizer"][0];
  round: EventByOrganizerQuery["eventByOrganizer"][0]["rounds"];
}> = ({ event, round }) => {
  const scrollToBottom = (divId: string) => {
    const targetdiv = document.getElementById(divId);
    if (targetdiv) {
      targetdiv.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [dbQuestions, setDbQuestions] = useState<Question[]>([]);
  const [saved, setSave] = useState(true);

  const eventId = event.id.toString();
  const roundNo = round[0]?.roundNo?.toString() ?? "";

  const concatId = eventId + "-" + roundNo;
  const questionsKey = "questions-" + concatId;

  // const [doneFetchLocal, setDoneFetchLocal] = useState(false);
  // const [doneFetchDB, setDoneFetchDB] = useState(false);

  const toggleCollapase = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, collapsed: !q.collapsed } : q)),
    );
  };

  const [quizDetails, setQuizDetails] =
    useState<QuizDetailsType>({
      quizTitle: "",
      description: "",
      startTime: new Date().toLocaleString(),
      endTime: new Date().toLocaleString(),
      password: "",
    }) ?? {};

  const {
    data: quizData,
    loading: quizLoading,
    refetch,
  } = useQuery(GetQuizByEventRoundDocument, {
    variables: {
      eventId: Number(eventId),
      roundId: Number(roundNo),
    },
    fetchPolicy: "network-only",
  });

  const fetchFromLocal = () => {
    console.log("Fetching from Local");
    if (typeof window !== "undefined") {
      const loadedQuestions =
        loadfromLocalStore<Question[]>(questionsKey) ?? [];
      console.log(loadedQuestions);
      loadedQuestions.map((q) => {
        if (questions.findIndex((qq) => qq.id === q.id) === -1) {
          console.log("THE FIRST");
          setLocalQuestions((prev) => [...prev, q]);
        } else {
          console.log("THE second");
          setLocalQuestions((prev) =>
            prev.map((qq) => {
              const newer = qq.id === q.id ? q : qq;
              return newer;
            }),
          );
        }
      });
    }
    console.log("DONE FETCH CHANGED 2222");
    // setDoneFetchLocal(true);
  };

  const fetchFromDB = () => {
    console.log("Fetching from DB");
    if (quizData) {
      const quiz = quizData.getQuizByEventRound;
      if (quiz.__typename === "QueryGetQuizByEventRoundSuccess") {
        if (quiz) {
          const loadedQuestions: Question[] =
            quiz.data.questions?.map((q) => {
              const qs: Question = {
                id: q.id,
                questionText: q.question,
                options: q.options.map((opt) => {
                  return opt.value;
                }),
                ansIndex: q.options.findIndex((opt) => opt.isAnswer),
                answer: q.options.find((opt) => opt.isAnswer)?.value ?? "",
                collapsed: true,
                isCode: q.isCode,
                description: q.description ?? "",
                imageUrl: q.image ?? "",
                mode: "view",
                createdAt: new Date(q.createdAt).toISOString() ?? "",
              };
              return qs;
            }) ?? [];

          const loadedQuizTitle: QuizDetailsType = {
            quizTitle: quiz.data?.name ?? "",
            description: quiz.data?.description ?? "",
            startTime: new Date(quiz.data?.startTime).toLocaleString(),
            endTime: new Date(quiz.data?.endTime).toLocaleString(),
            password: quiz.data.password ?? "",
          };

          const loadedQuizId = loadfromLocalStore("quizId");
          if (loadedQuizId !== quiz.data.id) {
            saveToLocalStore<Question[]>(questionsKey, []);
            saveToLocalStore("quizId", quiz.data.id);
          }

          setDbQuestions(loadedQuestions);
          setQuizDetails(loadedQuizTitle);
        }
      }
    }
    console.log("DONE FETCH CHANGED 11");
    // setDoneFetchDB(true);
  };

  useEffect(() => {
    console.log("FETCHING FROM DB AND LOCAL");
    fetchFromDB();
    fetchFromLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData]);

  const handleAddQuestions = () => {
    setSave(false);

    const newQuestion: Question = {
      id: generateUUID(),
      questionText: "",
      options: ["", "", "", ""],
      ansIndex: 0,
      answer: "",
      collapsed: false,
      isCode: false,
      description: "",
      imageUrl: "",
      mode: "new",
      createdAt: new Date().toISOString(),
    };

    const localQuestions = loadfromLocalStore<Question[]>(questionsKey) ?? [];
    localQuestions.push(newQuestion);
    saveToLocalStore<Question[]>(questionsKey, localQuestions);

    setQuestions((prev) => {
      const updatedQuestions = [
        ...prev.map((q) => ({ ...q, collapsed: true })),
      ];
      updatedQuestions.splice(prev.length, 0, newQuestion);

      console.log("ADDED QUESTION: ", updatedQuestions);
      return updatedQuestions;
    });
  };

  const handleCopyQuestion = (id: string, index: number) => {
    setSave(false);

    const question = questions.find((q) => q.id === id)!;

    const newQuestion: Question = {
      id: generateUUID(),
      questionText: question.questionText,
      options: question.options,
      ansIndex: question.ansIndex,
      answer: question.answer,
      collapsed: false,
      isCode: question.isCode,
      description: question.description,
      imageUrl: question.imageUrl,
      mode: "new",
      createdAt: new Date().toISOString(),
    };

    const localQuestions = loadfromLocalStore<Question[]>(questionsKey) ?? [];
    localQuestions.push(newQuestion);
    saveToLocalStore<Question[]>(questionsKey, localQuestions);

    setQuestions((prev) => {
      const updatedQuestions = [
        ...prev.map((q) => ({ ...q, collapsed: true })),
      ];

      updatedQuestions.splice(questions.length, 0, newQuestion);
      scrollToBottom(questions[questions.length - 1]!.id);
      return updatedQuestions;
    });
    const questionIndex = questions.findIndex((q) => q.id === id);
    toast.success(`Question ${questionIndex + 1} copied`);
  };

  const handleDeleteQuestions = (id: string) => {
    setSave(false);

    if (questions.length > 1) {
      const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
      const question = localQuestions?.find((q) => q.id === id);
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (question && question.mode === "new") {
        saveToLocalStore<Question[]>(
          questionsKey,
          localQuestions?.filter((q) => q.id !== id) ?? [],
        );
      } else {
        if (dbQuestion?.id) {
          localQuestions?.push({ ...dbQuestion, mode: "delete" });
          saveToLocalStore<Question[]>(questionsKey, localQuestions ?? []);
        }
      }
      setQuestions((prev) => {
        return prev.filter((q) => q.id !== id);
      });
    } else {
      toast.error("Quiz must have at least one question");
    }
  };

  const handleQuestionTextChange = (id: string, value: string) => {
    setSave(false);

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? { ...q, questionText: value, mode: "edit" as const }
            : { ...q, questionText: value }
          : q,
      ),
    );
    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id ? { ...q, questionText: value } : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion) {
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          { ...dbQuestion, mode: "edit" },
        ]);
      }
    }
  };

  const handleImage = (id: string, value: string) => {
    setSave(false);

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? { ...q, imageUrl: value, mode: "edit" as const }
            : { ...q, imageUrl: value }
          : q,
      ),
    );
    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id ? { ...q, imageUrl: value } : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion) {
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          { ...dbQuestion, imageUrl: value, mode: "edit" },
        ]);
      }
    }
  };

  const handleOptionChange = (
    id: string,
    optionIndex: number,
    value: string,
  ) => {
    setSave(false);

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? {
                ...q,
                options: q.options.map((opt, i) =>
                  i === optionIndex ? value : opt,
                ),
                answer: q.ansIndex === optionIndex ? value : q.answer,
                mode: "edit" as const,
              }
            : {
                ...q,
                options: q.options.map((opt, i) =>
                  i === optionIndex ? value : opt,
                ),
                answer: q.ansIndex === optionIndex ? value : q.answer,
              }
          : q,
      ),
    );

    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id
            ? {
                ...q,
                options: q.options.map((opt, i) =>
                  i === optionIndex ? value : opt,
                ),
                answer: q.ansIndex === optionIndex ? value : q.answer,
              }
            : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion)
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          {
            ...dbQuestion,
            options: dbQuestion.options.map((opt, i) =>
              i === optionIndex ? value : opt,
            ),
            answer:
              dbQuestion.ansIndex === optionIndex ? value : dbQuestion.answer,
            mode: "edit",
          },
        ]);
    }
  };

  const handleAnswerChange = (
    id: string,
    optIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSave(false);

    console.log("Answer Changed: ", e.target.name);
    console.log("Answer Id: ", e.target.id);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? {
                ...q,
                ansIndex: optIndex,
                answer: q.options[optIndex] ?? "",
                mode: "edit" as const,
              }
            : { ...q, ansIndex: optIndex, answer: q.options[optIndex] ?? "" }
          : q,
      ),
    );
    console.log("Answer Changed: ", questions);
    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id
            ? {
                ...q,
                ansIndex: optIndex,
                answer: q.options[optIndex] ?? "",
              }
            : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion)
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          {
            ...dbQuestion,
            ansIndex: optIndex,
            answer: dbQuestion.options[optIndex] ?? "",
            mode: "edit",
          },
        ]);
    }
  };

  // const handleNewOption = (id: string) => {
  //   setSave(false);

  //   setQuestions((prev) =>
  //     prev.map((q) =>
  //       q.id === id
  //         ? q.mode === "view"
  //           ? { ...q, options: [...q.options, ""], mode: "edit" as const }
  //           : { ...q, options: [...q.options, ""] }
  //         : q,
  //     ),
  //   );
  //   const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
  //   if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
  //     saveToLocalStore<Question[]>(
  //       questionsKey,
  //       localQuestions?.map((q) =>
  //         q.id === id ? { ...q, options: [...q.options, ""] } : q,
  //       ) ?? [],
  //     );
  //   } else {
  //     const dbQuestion = dbQuestions.find((q) => q.id === id);
  //     if (dbQuestion)
  //       saveToLocalStore<Question[]>(questionsKey, [
  //         ...(localQuestions ?? []),
  //         { ...dbQuestion, options: [...dbQuestion.options, ""], mode: "edit" },
  //       ]);
  //   }
  // };

  // const handleDeleteOption = (id: string) => {
  //   setSave(false);

  //   setQuestions((prev) =>
  //     prev.map((q) =>
  //       q.id === id && q.options.length > 2
  //         ? q.mode === "view"
  //           ? { ...q, options: q.options.slice(0, -1), mode: "edit" as const }
  //           : { ...q, options: q.options.slice(0, -1) }
  //         : q,
  //     ),
  //   );

  //   const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
  //   if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
  //     saveToLocalStore<Question[]>(
  //       questionsKey,
  //       localQuestions?.map((q) =>
  //         q.id === id && q.options.length > 2
  //           ? { ...q, options: q.options.slice(0, -1) }
  //           : q,
  //       ) ?? [],
  //     );
  //   } else {
  //     const dbQuestion = dbQuestions.find((q) => q.id === id);
  //     if (dbQuestion && dbQuestion.options.length > 2)
  //       saveToLocalStore<Question[]>(questionsKey, [
  //         ...(localQuestions ?? []),
  //         {
  //           ...dbQuestion,
  //           options: dbQuestion.options.slice(0, -1),
  //           mode: "edit",
  //         },
  //       ]);
  //   }
  // };

  const handleIsCode = (id: string) => {
    setSave(false);

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? { ...q, isCode: !q.isCode, mode: "edit" as const }
            : { ...q, isCode: !q.isCode }
          : q,
      ),
    );
    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id ? { ...q, isCode: !q.isCode } : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion)
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          { ...dbQuestion, isCode: !dbQuestion.isCode, mode: "edit" },
        ]);
    }
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setSave(false);

    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) =>
        q.id === id
          ? q.mode === "view"
            ? { ...q, description: value, mode: "edit" as const }
            : { ...q, description: value }
          : q,
      );
      return updatedQuestions;
    });

    const localQuestions = loadfromLocalStore<Question[]>(questionsKey);
    if (localQuestions?.findIndex((q) => q.id === id) !== -1) {
      saveToLocalStore<Question[]>(
        questionsKey,
        localQuestions?.map((q) =>
          q.id === id ? { ...q, description: value } : q,
        ) ?? [],
      );
    } else {
      const dbQuestion = dbQuestions.find((q) => q.id === id);
      if (dbQuestion)
        saveToLocalStore<Question[]>(questionsKey, [
          ...(localQuestions ?? []),
          { ...dbQuestion, description: value, mode: "edit" },
        ]);
    }
  };

  const validateQuiz = () => {
    if (questions.length === 0) {
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

  const [updateQuiz, { loading: updateQuizLoading }] = useMutation(
    UpdateQuizDocument,
    {
      refetchQueries: ["UpdateQuiz"],
      awaitRefetchQueries: true,
    },
  );

  const handleQuizUpdation = async () => {
    setSave(true);
    let quizId;
    const localUnfilteredQuestions =
      loadfromLocalStore<Question[]>(questionsKey);
    const localQuestions =
      localUnfilteredQuestions?.filter((q) => q.questionText !== "") ?? [];
    if (
      quizData?.getQuizByEventRound.__typename ===
      "QueryGetQuizByEventRoundSuccess"
    )
      quizId = quizData.getQuizByEventRound.data.id;
    const promise = updateQuiz({
      variables: {
        quizId: quizId,
        questions: localQuestions
          ? localQuestions.map((question) => ({
              id: question.id,
              question: question.questionText,
              isCode: question.isCode,
              options: question.options.map((opt, index) => ({
                value: opt,
                isAnswer: index === question.ansIndex,
              })),
              createdAt: question.createdAt,
              description: question.description,
              image: question.imageUrl,
              mode: question.mode,
            }))
          : [],
      },
    }).then((res) => {
      res.errors?.forEach((error) => {
        console.error(error);
      });
      if (res.data?.updateQuiz.__typename !== "MutationUpdateQuizSuccess") {
        return Promise.reject(new Error("Error creating quiz"));
      }
      if (res.data?.updateQuiz.__typename === "MutationUpdateQuizSuccess") {
        saveToLocalStore<Question[]>(questionsKey, []);
        refetch()
          .then(() => {
            console.log("REFETCHED");
            setQuestions((prev) => {
              return prev.map((q) => ({ ...q, collapsed: true }));
            });
          })
          .catch((err) => {
            console.log("ERROR REFETCHING");
          });
        // fetchFromLocal();
        setLocalQuestions([]);
        return res.data?.updateQuiz.data.id;
      }
    });
    return promise;
  };

  const handlePrint = async () => {
    const errors = validateQuiz();
    if (!errors) {
      const quizId: string | undefined = await handleQuizUpdation();
      if (quizId) {
        console.log("Quiz Submitted:", { quizDetails, questions });
        console.log("success");
        toast.success("Questions saved successfully");
      } else {
        toast.error("Error updating quiz");
      }
    } else {
      console.log(questions, quizDetails);
      toast.error(errors);
    }
  };

  useEffect(() => {
    const combinedQuestions = [...localQuestions, ...dbQuestions];

    const uniqueQuestions = combinedQuestions.filter(
      (question, index, self) =>
        index === self.findIndex((q) => q.id === question.id),
    );

    const uniqueSortedQuestions = uniqueQuestions.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const filteredQuestions = uniqueSortedQuestions.filter(
      (question) => question.mode !== "delete",
    );

    const uniqueLocalQuestions = uniqueQuestions.filter((q) => {
      return q.mode !== "view";
    });
    saveToLocalStore<Question[]>(questionsKey, uniqueLocalQuestions);

    setQuestions(filteredQuestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQuestions, dbQuestions]);

  return (
    <>
      {quizLoading && (
        <div className="flex justify-center items-center h-full">
          <BiLoaderAlt className="animate-spin text-4xl" />
        </div>
      )}
      <div className="my-12">
        <div className="flex h-auto w-full flex-col items-start rounded-3xl bg-gray-900/90 p-6 px-8">
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row items-center">
              <label
                className="self-center font-gilroy text-lg text-white/85"
                htmlFor="quizTitle"
              >
                Quiz Title:
              </label>
              <input
                className=" self-center w-80 rounded-2xl ml-4 bg-slate-800 bg-opacity-30 bg-clip-padding p-2 px-4 text-lg font-medium outline-none backdrop-blur-3xl backdrop-filter text-white/70"
                placeholder="Enter quiz title"
                id="quizTitle"
                value={quizDetails.quizTitle}
                readOnly
              />
            </div>

            <div className="flex flex-row font-gilroy text-xl self-center text-nowrap items-center">
              <label
                htmlFor="startTime"
                className="w-full text-lg text-white/85"
              >
                Start Time:
              </label>
              <input
                className=" self-center w-80 rounded-2xl bg-slate-800 bg-opacity-30 bg-clip-padding p-2 px-4 text-lg font-medium backdrop-blur-3xl backdrop-filter text-white/70"
                placeholder="Quiz Start Time"
                id="startTime"
                value={quizDetails.startTime}
                readOnly
              />
              <label
                htmlFor="startTime"
                className="w-full ml-12 text-lg text-white/85"
              >
                End Time:
              </label>
              <input
                className=" self-center w-80 rounded-2xl bg-slate-800 bg-opacity-30 bg-clip-padding p-2 px-4 text-lg font-medium backdrop-blur-3xl backdrop-filter text-white/70"
                placeholder="Quiz End Time"
                id="endTime"
                value={quizDetails.endTime}
                readOnly
              />
            </div>
          </div>
          {quizDetails.description && (
            <div className="flex flex-row w-full">
              <textarea
                name="quizDescription"
                id="quizDescription"
                rows={4}
                readOnly
                className="text-lg h-auto w-full mt-4 rounded-3xl bg-slate-800 bg-opacity-20 bg-clip-padding px-4 py-6 outline-none backdrop-blur-3xl backdrop-filter text-white/70"
                placeholder="Quiz Description"
                value={quizDetails.description}
              ></textarea>
            </div>
          )}
          <div className="flex flex-row items-center mt-4">
            <label
              className="self-center font-gilroy text-lg text-white/85"
              htmlFor="quizPassword"
            >
              Quiz Password:
            </label>
            <input
              className=" self-center w-80 rounded-2xl ml-4 bg-slate-800 bg-opacity-30 bg-clip-padding p-2 px-4 text-lg font-medium outline-none backdrop-blur-3xl backdrop-filter text-white/70"
              placeholder="Enter quiz title"
              id="quizTitle"
              value={quizDetails.password}
              readOnly
            />
          </div>
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
              isCode={q.isCode}
              description={q.description}
              imageUrl={q.imageUrl}
              questionMode={q.mode}
              handleImage={handleImage}
              toggleCollapase={toggleCollapase}
              handleQuestionTextChange={handleQuestionTextChange}
              handleOptionChange={handleOptionChange}
              handleAnswerChange={handleAnswerChange}
              handleDeleteQuestions={handleDeleteQuestions}
              handleAddQuestions={handleAddQuestions}
              handleCopyQuestion={handleCopyQuestion}
              handleIsCode={handleIsCode}
              handleDescriptionChange={handleDescriptionChange}
            />
          ))}
        </div>
        <div className="flex mt-4 items-center">
          <Button
            className="rounded-md h-14 w-auto fixed bottom-12 left-12 z-50"
            intent={saved ? "info" : "danger"}
            size={"large"}
            disabled={updateQuizLoading}
            onClick={handlePrint}
          >
            {updateQuizLoading ? (
              <>
                <BiLoaderAlt className="animate-spin text-xl" />
                Saving Draft...{" "}
              </>
            ) : (
              <>
                <Save className="text-xl" /> Save Draft
              </>
            )}
          </Button>
        </div>
        <Button
          intent={"success"}
          onClick={handleAddQuestions}
          className="fixed bottom-12 font-bold rounded-lg right-12 h-14 w-auto bg-blue-500 text-white hover:bg-blue-600 z-50"
        >
          Add Question +
        </Button>
      </div>
    </>
  );
};

export default Quiz;
