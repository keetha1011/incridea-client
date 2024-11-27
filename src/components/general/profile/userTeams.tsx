import { FC } from "react";

import { EventType } from "~/generated/generated";

import TeamCard from "./teamCard";

export type Team = {
  id: string;
  name: string;
  confirmed: boolean;
  leaderId: string;
  event: {
    minTeamSize: number;
    id: string;
    name: string;
    maxTeamSize: number;
    fees: number;
    eventType: EventType;
  };
  members: {
    user: {
      id: string;
      name: string;
    };
  }[];
};

const UserTeams: FC<{
  teams: any;
  userId: string;
  name: string;
  email: string;
}> = ({ teams, userId, name, email }) => {
  // Todo: Show winning status (if any)
  return (
    <section className="mt-2">
      {/* <h1
        className={`titleFont text-2xl lg:text-4xl font-bold text-center text-white flex justify-center lg:max-w-full md:max-w-full max-w-sm`}
      >
        Set sail with your Squad
      </h1> */}
      <div className="flex flex-wrap items-stretch justify-center gap-5">
        {teams?.map((team: Team) => (
          <TeamCard
            key={team.id}
            team={team}
            userId={userId}
            solo={
              team.event.eventType === "INDIVIDUAL" ||
              team.event.eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
            }
            name={name}
            email={email}
          />
        ))}
      </div>
    </section>
  );
};

export default UserTeams;
