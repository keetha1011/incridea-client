import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { EventByOrganizerDocument } from "~/generated/generated";
import { GetQuizScoresDocument } from "~/generated/generated";
import { PromoteQuizParticipantsDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";
import { Role } from "~/generated/generated";
import { idToTeamId, teamIdToId } from "~/utils/id";
import {
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineSearch,
} from "react-icons/ai";
import { Button } from "~/components/ui/button";
import createToast from "~/components/toast";

type Leaderboard = {
  score: number;
  teamName: string;
  teamId: string;
  timeTaken: number;
  selected: boolean;
};

const QuizLeaderboard = () => {
  const router = useRouter();
  const { user, loading: loading2 } = useAuth();
  const { slug } = router.query;
  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");

  const [query, setQuery] = useState<string>("");
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

  const [promoteQuizParticipants, { loading: promoteQuizParticipantsLoading }] =
    useMutation(PromoteQuizParticipantsDocument);

  useEffect(() => {
    if (
      quizScores?.getQuizScores.__typename === "QueryGetQuizScoresSuccess" &&
      !processedQuizScores
    ) {
      const scores = quizScores.getQuizScores.data;
      const qualifyNext = scores[0]?.quiz.qualifyNext ?? 5;

      console.log(scores);

      const leaderboard = scores.map((score) => ({
        score: score.score,
        teamName: score.team.name,
        teamId: idToTeamId(score.teamId.toString()),
        timeTaken: score.timeTaken,
        selected: false,
      }));

      leaderboard.sort((a, b) => {
        if (a.score === b.score) {
          return a.timeTaken - b.timeTaken;
        }
        return b.score - a.score;
      });

      leaderboard.forEach((user, i) => {
        user.selected = i < qualifyNext;
      });

      setSortedLeaderboard(leaderboard);
      console.log(sortedLeaderboard);
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

  const handlePromote = async () => {
    const promise = promoteQuizParticipants({
      variables: {
        quizId,
        teams: sortedLeaderboard
          .filter((team) => team.selected)
          .map((team) => parseInt(teamIdToId(team.teamId) ?? "0")),
        eventId: parseInt(eventId ?? "0"),
        roundId: roundInt,
      },
    })
      .then((res) => {
        if (
          res.data?.promoteQuizParticipants.__typename ===
          "MutationPromoteQuizParticipantsSuccess"
        ) {
          console.log("Promoted successfully");
          router.reload();
        } else {
          console.error("Failed to promote", res.errors);
          throw new Error("Failed to promote participants/teams");
        }
      })
      .catch(async (err) => {
        console.error("Failed to promote", err);
        const errorMessage =
          err instanceof Error ? err : new Error(String(err));
        await createToast(
          Promise.reject(errorMessage),
          "Failed to promote participants/teams",
        );
      });

    await createToast(Promise.resolve(promise), "Promoting participants...");
  };

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

  if (quizScores?.getQuizScores.__typename === "Error") {
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl">
        {quizScores.getQuizScores.message}
      </div>
    );
  }

  return (
    <Dashboard>
      <div
        className={``}
        style={{ willChange: "transform", overflowX: "hidden" }}
      >
        <div className="relative min-h-screen mt-10">
          <div className="text-center font-sans text-4xl text-white md:text-4xl font-bold flex justify-between w-full px-10">
            <p>Hello, {user.name}</p>
            <p>
              {round?.quiz?.name} of {event?.name}(Round {round?.roundNo})
            </p>
          </div>
          <div className="relative min-h-screen flex gap-x-4 mt-4">
            {quizScoresLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-gray-300" />
              </div>
            )}

            <div className="w-1/2 bg-primary-800 rounded-t-xl overflow-clip h-screen">
              <div className="h-20 flex w-full bg-[#35436F] text-3xl items-center p-4 relative">
                <input
                  className="h-full border-0 bg-white/20 text-xl p-2 w-full rounded-md"
                  placeholder="Search by name or PID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                />
                <AiOutlineSearch
                  size={"1.4rem"}
                  className="absolute right-7 text-white/60"
                />
              </div>
              <div className="m-4 grid grid-cols-5 h-16 items-center rounded-lg rounded-t-lg bg-primary-500 bg-opacity-20 text-sm font-bold text-white text-center md:text-xl">
                <h1>Name</h1>
                <h1>ID</h1>
                <h1>Score</h1>
                <h1>Duration</h1>
                <h1>Promote</h1>
              </div>
              <div className="overflow-y-scroll h-[80%] pb-10">
                {sortedLeaderboard
                  .filter(
                    (team) =>
                      team.teamName
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      team.teamId.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((user) => {
                    return (
                      !user.selected && (
                        <div
                          key={user.teamId}
                          className="h-16 mx-4 grid grid-cols-5 items-center justify-items-center rounded-lg shadow-2xl text-sm md:text-xl"
                        >
                          {/* <p className="border rounded-2xl border-green-700 text-green-700 absolute left-20">Qualified</p> */}
                          <p>{user.teamName}</p>
                          <p>{user.teamId}</p>
                          <p>{user.score}</p>
                          <p>{user.timeTaken.toFixed(3)}</p>
                          <Button
                            className={`h-8 w-8 bg-green-500 hover:bg-green-700 justify-self-center aspect-square p-1`}
                            onClick={() => {
                              const leaderboard = [...sortedLeaderboard];
                              leaderboard.forEach((team) => {
                                if (team.teamId === user.teamId)
                                  team.selected = true;
                              });
                              setSortedLeaderboard(leaderboard);
                            }}
                          >
                            <AiOutlineCheck />
                          </Button>
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
            <div className="w-1/2 bg-primary-800 rounded-t-xl overflow-clip h-screen">
              <div className="h-20 flex w-full text-3xl items-center p-4 bg-[#35436F]">
                Selected Teams
              </div>
              <div className="m-4 grid grid-cols-9 h-16 justify-items-center items-center rounded-lg rounded-t-lg bg-primary-500 bg-opacity-20 text-sm font-bold text-white md:text-xl">
                <h1 className="col-span-2">Name</h1>
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">Score</h1>
                <h1 className="col-span-2">Duration</h1>
              </div>
              <div className="overflow-y-scroll h-[70%] pb-10">
                {sortedLeaderboard.map((user, i) => {
                  return (
                    user.selected && (
                      <div
                        key={user.teamId}
                        className="h-16 mx-4 grid grid-cols-9 items-center rounded-lg shadow-2xl justify-items-center text-sm md:text-xl"
                      >
                        {/* <p className="border rounded-2xl border-green-700 text-green-700 absolute left-20">Qualified</p> */}
                        <h1 className="col-span-2">{user.teamName}</h1>
                        <h1 className="col-span-2">{user.teamId}</h1>
                        <h1 className="col-span-2">{user.score}</h1>
                        <h1 className="col-span-2">
                          {user.timeTaken.toFixed(3)}
                        </h1>
                        <Button
                          className="bg-red-500 right-0 mx-[5%] aspect-square p-1 hover:bg-red-700"
                          onClick={() => {
                            const leaderboard = [...sortedLeaderboard];
                            leaderboard.forEach((team) => {
                              if (team.teamId === user.teamId)
                                team.selected = false;
                            });
                            setSortedLeaderboard(leaderboard);
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </div>
                    )
                  );
                })}
              </div>
              {sortedLeaderboard.filter((team) => team.selected).length > 0 && (
                <Button
                  className="text-2xl p-5 m-5 bg-green-500 hover:bg-green-700"
                  onClick={handlePromote}
                >
                  {promoteQuizParticipantsLoading
                    ? "Promoting..."
                    : "Confirm Teams"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default QuizLeaderboard;
