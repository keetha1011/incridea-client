import { useQuery } from "@apollo/client";

import { WinnersByEventDocument } from "~/generated/generated";
import { idToTeamId, teamIdToId } from "~/utils/id";

import ViewTeamModal from "./ViewTeamModal";

const ViewWinners = ({ eventId }: { eventId: string }) => {
  const { data: winners, loading: winnersLoading } = useQuery(
    WinnersByEventDocument,
    {
      variables: {
        eventId: eventId!,
      },
      skip: !eventId,
    },
  );

  return (
    <div>
      {winnersLoading && <div>Loading...</div>}
      {!winners && <div>No winners yet</div>}
      <>
        <div
          className={`mb-2 flex items-center rounded-lg bg-white/10 p-2 px-5`}
        >
          <div className="flex w-full flex-row gap-5">
            <div className={`basis-1/4 text-white/80`}>Name</div>
            <div className={`basis-1/4 text-white/80`}>ID</div>
            <div className={`basis-1/4 text-white/80`}>Type</div>
            <div className={`basis-1/4 text-white/80`}>View Team</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {winners?.winnersByEvent.__typename ===
            "QueryWinnersByEventSuccess" &&
            winners?.winnersByEvent.data.map((winner) => {
              return (
                <div
                  key={winner.id}
                  className={`flex items-center rounded-lg bg-white/10 p-2 px-5`}
                >
                  <div className="flex w-full flex-row gap-5">
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.team.name}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {idToTeamId(winner.team.id)}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.type}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      <ViewTeamModal
                        teamId={winner.team.id}
                        teamName={winner.team.name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    </div>
  );
};

export default ViewWinners;
