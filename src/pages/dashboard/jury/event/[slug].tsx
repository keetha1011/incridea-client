import { useQuery } from "@apollo/client";
import { Tab } from "@headlessui/react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
  NextPageContext,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { CSVLink } from "react-csv";

import ViewTeamModal from "~/components/general/dashboard/jury/viewTeamModal";
import ViewWinners from "~/components/general/dashboard/jury/viewWinners";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import {
  EventByIdDocument,
  EventByIdQuery,
  GetScoreSheetJuryDocument,
  QueryGetScoreSheetJuryViewSuccess,
} from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

import { StatusBadge } from "..";

const getServerSideProps = async (context: NextPageContext) => {
  const query = context.query;
  const slug = query.slug as string;
  return { props: { slug: slug } };
};

const Page = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useQuery(EventByIdDocument, {
    variables: {
      id: slug.split("-").pop() as string,
    },
  });

  if (loading || eventLoading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );
  if (!user) {
    router.push("/login");
    return <div>Redirecting...</div>;
  }
  if (user.role !== "JURY") {
    router.push("/profile");
    return <div>Redirecting...</div>;
  }
  if (!event) return <div>Event not found</div>;
  return (
    <Dashboard>
      <RoundTabs eventId={event.eventById.id} rounds={event.eventById.rounds} />
    </Dashboard>
  );
};

const RoundTabs = ({
  rounds,
  eventId,
}: {
  rounds: EventByIdQuery["eventById"]["rounds"];
  eventId: string;
}) => {
  const getCompletedRounds = (
    rounds: EventByIdQuery["eventById"]["rounds"],
  ) => {
    let completedRounds = 0;
    rounds.forEach((round) => {
      if (round.completed === true) completedRounds++;
    });
    return completedRounds;
  };
  const getRoundStatus = (
    round: EventByIdQuery["eventById"]["rounds"][0],
    totalRounds: number,
  ) => {
    if (round.completed) return "COMPLETED";
    if (
      new Date(
        rounds.find((r) => r.roundNo === round.roundNo)?.date,
      ).getTime() > new Date().getTime()
    )
      return "YET_TO_START";
    return "ONGOING";
  };
  return (
    <Tab.Group
      as={"div"}
      className="mt-5 overflow-hidden border-0 border-gray-900/40 sm:rounded-xl"
    >
      <Tab.List className="flex w-full overflow-x-auto bg-gray-400/20 backdrop-blur-md">
        {rounds.map((round) => (
          <Tab
            key={`${round.roundNo}-${eventId}`}
            className="focus:outline-none"
          >
            {({ selected }) => (
              <button
                className={`whitespace-nowrap p-3 text-base font-semibold transition-colors sm:px-5 sm:py-4 sm:text-lg ${
                  selected
                    ? "bg-gray-900 text-white shadow-lg shadow-black"
                    : "bg-transparent text-white hover:bg-gray-800/60"
                }`}
              >
                <span>Round {round.roundNo} </span>
                <StatusBadge
                  status={getRoundStatus(round, rounds.length)}
                />{" "}
              </button>
            )}
          </Tab>
        ))}
        <Tab className="focus:outline-none" key="winners">
          {({ selected }) => (
            <button
              className={`whitespace-nowrap p-3 text-base font-semibold transition-colors sm:px-5 sm:py-4 sm:text-lg ${
                selected
                  ? "bg-gray-900 text-white shadow-lg shadow-black"
                  : "bg-transparent text-white hover:bg-gray-800/60"
              }`}
            >
              <span>Winners</span>
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        {rounds.map((round) => (
          <Tab.Panel key={`${round.roundNo}-${eventId}`}>
            <RoundTable eventId={eventId} roundNo={round.roundNo} />
          </Tab.Panel>
        ))}
        <Tab.Panel key={`winners`}>
          <ViewWinners eventId={eventId} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const RoundTable = ({
  eventId,
  roundNo,
}: {
  eventId: string;
  roundNo: number;
}) => {
  const {
    data: round,
    loading: roundLoading,
    error: roundError,
  } = useQuery(GetScoreSheetJuryDocument, {
    variables: {
      eventId: eventId,
      roundNo: roundNo,
    },
  });

  if (roundLoading) return <Spinner />;
  if (!round) return <div>Something went wrong</div>;
  if (roundError || round.getScoreSheetJuryView.__typename === "Error")
    return <div>Something went wrong</div>;
  if (round.getScoreSheetJuryView.data.length === 0)
    return <div>Nothing to show</div>;
  return (
    <JudgeTable
      judges={round.getScoreSheetJuryView.data[0]!.judges}
      teams={round.getScoreSheetJuryView.data}
    />
  );
};

const JudgeTable = ({
  judges,
  teams,
}: {
  judges: QueryGetScoreSheetJuryViewSuccess["data"][0]["judges"];
  teams: QueryGetScoreSheetJuryViewSuccess["data"];
}) => {
  const [csvData, setCsvData] = useState<{}[]>([]);
  const [judgeName, setJudgeName] = useState<string | null>(null);
  const process = (judgeId: any) => {
    const judgesData: any = [];
    const teamData: any = [];
    const data = [];
    teams.map((team) => {
      const judges: any = team.judges;
      teamData.push(team?.teamName);
      const temp = judges?.filter((judge: any) => judge?.judgeId === judgeId);
      judgesData.push(temp);
    });
    data.push({ JudgeName: judgesData[0][0]?.judgeName });

    teamData.map((team: any, index: any) => {
      const obj: {
        [key: string]: any;
      } = {};
      let sum = 0;
      obj.teamNames = team;
      judgesData[index][0]?.criteria?.map((data: any) => {
        obj[data.criteriaName] = data.score;
        sum += data.score;
      });
      obj.judgeTotal = sum;
      data.push(obj);
    });
    return data;
  };

  const [modal, setModal] = useState(false);

  return (
    <Tab.Group>
      <Tab.List className="flex w-full items-center gap-5 bg-gray-300/20 p-2 text-white">
        <span className="ml-3 text-xl font-semibold">Judges </span>
        {judges.map((judge) => (
          <Tab
            key={judge.judgeId}
            className="flex w-fit items-center gap-2 p-2 outline-none"
          >
            {({ selected }) => (
              <button
                onClick={() => {
                  setCsvData(process(judge?.judgeId));
                  setJudgeName(judge?.judgeName);
                }}
                className={`px-4 py-2 font-semibold shadow-md hover:bg-gray-700/90 ${
                  selected ? "bg-gray-700" : "bg-gray-600"
                }`}
              >
                {judge.judgeName}
              </button>
            )}
          </Tab>
        ))}
        {judgeName ? (
          <button className="ml-auto mr-5 rounded-sm bg-green-500 p-2">
            <CSVLink data={csvData}>
              Download Score sheet by {judgeName}
            </CSVLink>
          </button>
        ) : (
          <p className="ml-auto mr-5 bg-gray-800 p-3 font-semibold shadow-md">
            Click a judge for download option
          </p>
        )}
      </Tab.List>
      <Tab.Panels>
        {judges.map((judge) => (
          <Tab.Panel key={judge.judgeName}>
            <div className="hidden h-16 items-center justify-between gap-2.5 bg-white bg-opacity-20 bg-clip-padding p-1 text-xl font-bold backdrop-blur-lg backdrop-filter md:flex">
              <div className="basis-1/3 py-2.5 pl-2 text-center">Team Name</div>
              {judge.criteria.map((criteria) => (
                <div
                  key={criteria.criteriaId}
                  className="basis-1/3 py-2.5 pl-2 text-center"
                >
                  {criteria.criteriaName}
                </div>
              ))}
              <div className="basis-1/3 py-2.5 pl-2 text-center">
                Judge Total
              </div>
              <div className="basis-1/3 py-2.5 pr-2 text-center">
                Grand Total
              </div>
            </div>
            {teams.map((team) => (
              <div
                key={team.teamId}
                className="mb-3 flex w-full flex-col items-start rounded-lg bg-white/10 p-3 md:my-0 md:flex-row md:items-center md:justify-evenly md:rounded-none md:p-4 md:text-center"
              >
                <div
                  onClick={() => setModal(true)}
                  className="basis-1/3 py-0.5 text-center text-lg"
                >
                  {team.teamName}
                </div>
                <ViewTeamModal
                  teamId={team.teamId.toString()}
                  teamName={team.teamName}
                />

                {team.judges
                  .find((j) => j.judgeId === judge.judgeId)
                  ?.criteria.map((criteria) => (
                    <div
                      key={criteria.criteriaId}
                      className="basis-1/3 py-0.5 text-center text-lg"
                    >
                      {criteria.score}
                    </div>
                  ))}
                <div className="basis-1/3 py-0.5 text-center text-lg">
                  {team.judges
                    .find((j) => j.judgeId === judge.judgeId)
                    ?.criteria.reduce((acc, curr) => acc + curr.score, 0)}
                </div>
                <div className="basis-1/3 py-0.5 text-center text-lg">
                  {team.teamScore}
                </div>
              </div>
            ))}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export { getServerSideProps };
export default Page;
