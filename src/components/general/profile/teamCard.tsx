import { QRCodeSVG } from "qrcode.react";

import { idToPid, idToTeamId } from "~/utils/id";

import DeleteTeamModal from "./deleteTeam";
import EditTeamModal from "./editTeam";
import { QueryRegisteredEventsSuccess } from "~/generated/generated";

// For both Team and Solo Teams
const TeamCard = ({
  team,
  userId,
  solo,
}: {
  team: QueryRegisteredEventsSuccess["data"][number]["teams"][number];
  userId: string;
  name: string;
  email: string;
  solo?: boolean;
}) => {
  return (
    <div
      key={team.id}
      className="relative items-start justify-center rounded-lg text-gray-100"
    >
      <div>
        <div className="titleFont flex items-center justify-center text-center text-3xl font-bold text-gray-200">
          <div>{solo ? idToPid(userId) : team.name}</div>
          {!team.confirmed && !solo && team.leaderId?.toString() == userId && (
            <EditTeamModal userId={userId} team={team} />
          )}
          {!team.confirmed && solo && (
            <DeleteTeamModal teamId={team.id} solo={solo} />
          )}
        </div>

        <div className="flex flex-row items-center">
          <QRCodeSVG
            color="#ffffff"
            fgColor="#ffffffdd"
            value={solo ? idToPid(userId) : idToTeamId(team.id)}
            size={150}
            className="h-fit w-fit"
            bgColor="transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
