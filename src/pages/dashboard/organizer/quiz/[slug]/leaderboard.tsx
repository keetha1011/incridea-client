import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { EventByOrganizerDocument } from "~/generated/generated";
import { GetQuizScoresDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";
import { Role } from "~/generated/generated";
import { idToTeamId } from "~/utils/id";
import { CheckIcon } from "lucide-react";

type Leaderboard = {
  score: number;
  teamName: string;
  teamId: string;
  qualifyNext: number;
};

const QuizLeaderboard = () => {
  const router = useRouter();
  const { user, loading: loading2 } = useAuth();
  const { slug } = router.query;

  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");

  const [sortedLeaderboard, setSortedLeaderboard] = useState<Leaderboard[]>([]);
  const [processedQuizScores, setProcessedQuizScores] = useState(false);

  const { data } = useQuery(EventByOrganizerDocument, {
    variables: {
      organizerId: user?.id ?? "0",
    },
  });

  const event = data?.eventByOrganizer.find((event) => event.id === eventId);
  const round = event?.rounds.find((round) => round.roundNo === roundInt);
  const quizId = round?.quiz?.id;

  const { data: quizScores, loading: quizScoresLoading } = useQuery(
    GetQuizScoresDocument,
    {
      variables: { quizId },
      skip: !quizId,
    },
  );

  useEffect(() => {
    if (
      quizScores?.getQuizScores.__typename === "QueryGetQuizScoresSuccess" &&
      !processedQuizScores
    ) {
      const scores = quizScores.getQuizScores.data;

      console.log(scores);

      const leaderboard = scores.map((score) => ({
        score: score.score,
        teamName: score.team.name,
        qualifyNext: score.quiz.qualifyNext,
        teamId: idToTeamId(score.teamId.toString()),
      }));

      leaderboard.sort((a, b) => b.score - a.score);
      setSortedLeaderboard(leaderboard);
      setProcessedQuizScores(true);
    }
  }, [quizScores, processedQuizScores]);

  useEffect(() => {
    if (user && user.role !== Role.Organizer) {
      router.push("/profile").catch((err) => {
        console.error("Failed to redirect to profile", err);
      });
    }
  }, [user, router]);

  if (loading2) {
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }

  return (
    <Dashboard>
      <div
        className={``}
        style={{ willChange: "transform", overflowX: "hidden" }}
      >
        {/* {sortedLeaderboard.length > 0 && (
          <div className={`${styles.container} overflow-hidden`}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`${styles.confetti}`}></div>
            ))}
          </div>
        )} */}
        <div className="relative min-h-screen bg-gradient-to-b">
          <div className="relative min-h-screen py-20">
            <div className="flex flex-row justify-center">
              {/* <h1 className="font-sans text-3xl text-white md:text-3xl">Event Name: {event?.name}</h1> */}
              <h1
                className={`text-center font-sans text-4xl text-white md:text-4xl font-bold`}
              >
                Quiz Leaderboard
              </h1>
              {/* <h1 className="font-sans text-3xl text-white md:text-3xl">Round No: {round?.roundNo}</h1> */}
            </div>

            <div className="mx-5 mb-2 mt-10 flex h-16 items-center justify-evenly rounded-lg rounded-t-lg border border-primary-600 bg-primary-500 bg-opacity-20 bg-clip-padding p-1 text-sm font-bold text-white backdrop-blur-lg backdrop-filter md:mx-10 md:mt-7 md:text-2xl">
              <h1 className="basis-1/4 text-center">Position</h1>
              <h1 className="basis-1/4 text-center">Team Id</h1>
              <h1 className="basis-1/4 text-center">Team Name</h1>
              <h1 className="basis-1/4 text-center">Score</h1>
            </div>

            {quizScoresLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-gray-300" />
              </div>
            )}

            <div className="bodyFont mx-5 flex flex-col gap-2 text-center text-white md:mx-10">
              {sortedLeaderboard.map((user, i) => {
                return (
                  <div
                    key={user.teamId}
                    className="flex h-16 flex-row items-center justify-center rounded-lg shadow-2xl"
                  >
                    {/* <p className="border rounded-2xl border-green-700 text-green-700 absolute left-20">Qualified</p> */}
                    <h1
                      className={`flex basis-1/4 items-center justify-center text-center text-base md:gap-1 md:text-xl relative ${i + 1 <= user.qualifyNext && "pr-12"}`}
                    >
                      {i + 1 <= user.qualifyNext && (
                        <CheckIcon className="mr-4 border border-green-600 text-green-500 rounded-lg scale-75 md:scale-90 lg:scale-100" />
                      )}
                      {i + 1}
                    </h1>
                    <h1 className="mx-2 flex basis-1/4 items-center justify-center text-center text-sm font-semibold md:text-xl">
                      {user.teamId}
                    </h1>
                    <h1 className="flex basis-1/4 items-center justify-center text-center text-sm font-semibold capitalize md:text-xl">
                      {user.teamName}
                    </h1>
                    <h1 className="flex basis-1/4 items-center justify-center text-center text-sm font-semibold capitalize md:text-xl">
                      {user.score}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default QuizLeaderboard;
