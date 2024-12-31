import { GetServerSideProps } from "next";
// import { useRouter } from "next/router";
import IntroductionPage from "./Introduction";
import QuizPage from "./quizpage";
import { useState } from "react";

type Props = {
  quizId: string;
  error?: string;
};

type Question = {
  id: string;
  question: string;
  options: Options[];
};

type Options = {
  id: string;
  value: string;
  questionId: string;
};

const AttemptQuizPage = ({ quizId, error }: Props) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teamId, setTeamId] = useState<number>(0);
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" mt-16 border border-b-0">
      {isVerified ? (
        <QuizPage questions={questions} quizId={quizId} teamId={teamId} />
      ) : (
        <IntroductionPage
          setIsVerified={setIsVerified}
          setQuestions={setQuestions}
          quizId={quizId}
          setMyTeamId={setTeamId}
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
