import type { GetServerSideProps } from "next";
import { GetAllQuestionsDocument } from "~/generated/generated";
import IntroductionPage from "~/components/general/dashboard/organizer/quiz/Introduction";
import QuizPage from "~/components/general/dashboard/organizer/quiz/quizpage";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { BiLoader } from "react-icons/bi";

type Props = {
  quizId: string;
  error?: string;
};

export type Question = {
  id: string;
  question: string;
  description?: string | null;
  isCode?: boolean;
  options: Options[];
  image?: string | null;
};

export type Options = {
  id: string;
  value: string;
  questionId: string;
};

const AttemptQuizPage = ({ quizId, error }: Props) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [teamId, setTeamId] = useState<number>(0);

  const { data: questionsData } = useQuery(GetAllQuestionsDocument, {
    variables: { quizId: quizId },
    skip: !isVerified,
  });

  useEffect(() => {
    if (
      questionsData?.getAllquestions.__typename ===
      "QueryGetAllquestionsSuccess"
    )
      setQuestions(questionsData.getAllquestions.data);
  }, [questionsData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" mt-16 border border-b-0">
      {!isVerified ? (
        <IntroductionPage
          setIsVerified={setIsVerified}
          setQuestions={setQuestions}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          setName={setName}
          setDescription={setDescription}
          quizId={quizId}
          setMyTeamId={setTeamId}
        />
      ) : !(questions.length > 0) ? (
        <div className="w-full h-screen grid justify-center items-center text-3xl">
          {/* <p>Loading...</p> */}
          <BiLoader
            size={100}
            className="animate-spin h-6 w-6 text-primary-500"
          />
        </div>
      ) : (
        <QuizPage
          name={name}
          description={description}
          questions={questions}
          startTime={startTime}
          endTime={endTime}
          quizId={quizId}
          teamId={teamId}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { quizId } = context.params ?? {};
  // Example await expression to satisfy the async function requirement
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Here you can fetch quiz data based on quizId and roundNo
  // If there's an error, you can return it in the props

  return {
    props: {
      quizId,
    },
  };
};

export default AttemptQuizPage;
