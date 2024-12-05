import { useMutation } from "@apollo/client";
import React, { type FC, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { RemoveTeamMemberDocument } from "~/generated/generated";

const DeleteTeamMember: FC<{
  teamId: string;
  userId: string;
  name: string;
  editable?: boolean;
}> = ({ teamId, userId, name, editable }) => {
  const [showModal, setShowModal] = useState(false);

  const [deleteTeamMember, { loading: deleteMemberLoading }] = useMutation(
    RemoveTeamMemberDocument,
    {
      refetchQueries: ["RegisterdEvents"],
      awaitRefetchQueries: true,
    },
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (teamId: string) => {
    setShowModal(false);
    const promise = deleteTeamMember({
      variables: {
        teamId,
        userId,
      },
    }).then((res) => {
      if (
        res?.data?.removeTeamMember.__typename !==
        "MutationRemoveTeamMemberSuccess"
      ) {
        return Promise.reject(new Error("Error removing member"));
      }
    });
    await createToast(promise, "Removing");
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <Button
          size={"small"}
          onClick={() => {
            setShowModal(true);
          }}
          disabled={deleteMemberLoading || !editable}
          className="!skew-x-0 justify-center rounded-full"
        >
          <BiTrashAlt />
        </Button>
      </div>
      <Modal
        title={`Are you sure you want to remove ${name}?`}
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
            disabled={deleteMemberLoading}
          >
            {deleteMemberLoading ? (
              <Spinner intent={"white"} size={"small"} />
            ) : (
              "Remove"
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

export default DeleteTeamMember;
