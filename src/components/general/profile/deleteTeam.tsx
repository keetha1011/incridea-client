import { useMutation } from "@apollo/client";
import React, { FC, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { DeleteTeamDocument } from "~/generated/generated";

const DeleteTeamModal: FC<{
  teamId: string;
  solo?: boolean;
}> = ({ teamId, solo }) => {
  const [showModal, setShowModal] = useState(false);

  const [deleteTeam, { loading: deleteTeamLoading }] = useMutation(
    DeleteTeamDocument,
    {
      refetchQueries: ["RegisterdEvents", "MyTeam"],
      awaitRefetchQueries: true,
    },
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (teamId: string) => {
    setShowModal(false);
    const promise = deleteTeam({
      variables: {
        teamId: teamId,
      },
    }).then((res) => {
      if (res?.data?.deleteTeam.__typename !== "MutationDeleteTeamSuccess") {
        return Promise.reject(new Error("Error, something went wrong!"));
      }
    });
    await createToast(
      promise,
      solo ? "Unregistering from event" : "Deleting team",
    );
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setShowModal(true);
          }}
          disabled={deleteTeamLoading}
          size={solo ? "small" : "medium"}
          className="bodyFont !skew-x-0 justify-center rounded-full !tracking-normal"
        >
          {!solo && "Delete Team"}
          {solo ? <FaSignOutAlt /> : <BiTrashAlt />}
        </Button>
      </div>
      <Modal
        title={`${
          solo
            ? "Are you sure you want to unregister from the event?"
            : "Are you sure you want to delete the team?"
        }`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="bodyFont text-center text-sm">
          This action cannot be undone.
        </div>
        <div className="my-5 flex justify-center gap-3">
          <Button
            size={"small"}
            onClick={async () => await handleDelete(teamId)}
            disabled={deleteTeamLoading}
          >
            {deleteTeamLoading ? (
              <Spinner intent={"white"} size={"small"} />
            ) : solo ? (
              "Unregister"
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            size={"small"}
            intent={"ghost"}
            onClick={() => handleCloseModal()}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
