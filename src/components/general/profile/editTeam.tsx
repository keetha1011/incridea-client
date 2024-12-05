import React, { type FC, useState } from "react";
import { BiEditAlt } from "react-icons/bi";

import Badge from "~/components/badge";
import Button from "~/components/button";
import Modal from "~/components/modal";
import { idToTeamId } from "~/utils/id";

import AddMemberModal from "./addMember";
import DeleteTeamMember from "./deleteMember";
import DeleteTeamModal from "./deleteTeam";
import {
  type RegisterdEventsQuery,
  type RegisterdEventsQueryVariables,
} from "~/generated/generated";
import { type QueryResult } from "@apollo/client";

const EditTeamModal: FC<{
  team: Extract<
    NonNullable<
      QueryResult<RegisterdEventsQuery, RegisterdEventsQueryVariables>["data"]
    >["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number]["teams"][number];
  userId: string;
}> = ({ team, userId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        size={"small"}
        className="bodyFont !skew-x-0 !justify-center rounded-full !tracking-normal"
        fullWidth
      >
        Edit <BiEditAlt />
      </Button>
      <Modal
        title={`${team.name}`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"medium"}
      >
        <div className="w-full p-5">
          <div className="text-center">
            <h1 className={`titleFont mb-5 text-2xl`}>{idToTeamId(team.id)}</h1>
          </div>

          <div className="hidden items-center justify-between rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 font-bold backdrop-blur-lg backdrop-filter md:flex">
            <h1 className="w-full py-1 text-center">Name</h1>
            <h1 className="w-full py-1 text-center">Role</h1>
            <h1 className="w-full py-1 text-center">Remove</h1>
          </div>

          {team?.members?.map((member) => (
            <div
              className="my-2 flex items-center justify-between gap-2 rounded-sm bg-white bg-opacity-20 p-2 backdrop-blur-lg backdrop-filter"
              key={member.user.id}
            >
              <h1 className="w-full text-center">{member.user.name}</h1>{" "}
              <div className="w-full text-center">
                <Badge
                  color={
                    member.user.id == team.leaderId?.toString()
                      ? "success"
                      : "info"
                  }
                >
                  {member.user.id == team.leaderId?.toString()
                    ? "Leader"
                    : "Member"}
                </Badge>
              </div>
              {!team.confirmed && team.leaderId?.toString() == userId && (
                <DeleteTeamMember
                  teamId={team.id}
                  userId={member.user.id}
                  name={member.user.name}
                  editable={!(member.user.id == userId)}
                />
              )}
            </div>
          ))}
          <div className="flex justify-center">
            {!team.confirmed &&
              team.members.length < team.event.maxTeamSize && (
                <AddMemberModal team={team} />
              )}
          </div>
        </div>
        <div className="p-5">
          {!team.confirmed && team.leaderId?.toString() == userId && (
            <DeleteTeamModal teamId={team.id} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default EditTeamModal;
