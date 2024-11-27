import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { BiTrashAlt } from "react-icons/bi";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { OrganizerDeleteTeamDocument } from "~/generated/generated";

type Props = {
  teamId: string;
  attended: boolean;
  teamOrParticipant: string;
};

const DeleteTeamModal = ({ teamId, attended, teamOrParticipant }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const [deleteTeam, { loading: deleteTeamLoading }] = useMutation(
    OrganizerDeleteTeamDocument,
    {
      refetchQueries: ["TeamsByRound"],
      awaitRefetchQueries: true,
    },
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = (teamId: string) => {
    setShowModal(false);
    let promise = deleteTeam({
      variables: {
        teamId: teamId,
      },
    }).then((res) => {
      if (
        res?.data?.organizerDeleteTeam.__typename !==
        "MutationOrganizerDeleteTeamSuccess"
      ) {
        return Promise.reject("Error deleting team");
      }
    });
    createToast(promise, "Deleting");
  };

  return (
    <>
      <Button
        intent={"danger"}
        onClick={() => {
          setShowModal(true);
        }}
        disabled={attended || deleteTeamLoading}
        className="h-auto w-6 md:w-auto"
      >
        <BiTrashAlt />
      </Button>
      <Modal
        title={`Are you sure you want to delete ${teamOrParticipant} ${teamId}?`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="my-5 flex justify-center gap-3">
          <Button
            intent={"danger"}
            onClick={() => {
              handleDelete(teamId as string);
            }}
            disabled={attended || deleteTeamLoading}
          >
            {deleteTeamLoading ? (
              <Spinner intent={"white"} size={"small"} />
            ) : (
              "Delete"
            )}
          </Button>
          <Button intent={"secondary"} onClick={() => handleCloseModal()}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
