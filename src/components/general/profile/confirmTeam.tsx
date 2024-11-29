import { useMutation } from "@apollo/client";
import React, { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { GoVerified } from "react-icons/go";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { ConfirmTeamDocument } from "~/generated/generated";

const ConfirmTeamModal: FC<{
  teamId: string;
  canConfirm?: boolean;
  needMore?: number;
}> = ({ teamId, canConfirm, needMore }) => {
  const [showModal, setShowModal] = useState(false);

  const [confirmTeam, { loading: confirmTeamLoading }] = useMutation(
    ConfirmTeamDocument,
    {
      refetchQueries: ["RegisterdEvents"],
      awaitRefetchQueries: true,
    },
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = (teamId: string) => {
    setShowModal(false);
    const promise = confirmTeam({
      variables: {
        teamId,
      },
    }).then((res) => {
      if (res?.data?.confirmTeam.__typename !== "MutationConfirmTeamSuccess") {
        return Promise.reject("Error confirming team");
      }
    });
    createToast(promise, "Confirming");
  };

  return (
    <>
      <Button
        size={"medium"}
        className="bodyFont mt-3 !skew-x-0 justify-center rounded-full !tracking-normal"
        fullWidth
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        intent={"primary"}
      >
        <GoVerified />
        Confirm
      </Button>
      <Modal
        title={`Are you sure you want to confirm the team?`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="bodyFont mt-2 px-5 text-center text-sm">
          You won&apos;t be able to make changes to your team after confirming.
        </div>
        <div className="my-5 flex justify-center gap-3">
          <Button
            size={"small"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
              canConfirm
                ? handleConfirm(teamId)
                : toast.error(
                    `You need ${needMore} more members to confirm your team.`,
                    {
                      position: "bottom-center",
                    },
                  );
            }}
            disabled={confirmTeamLoading}
            className="bodyFont !skew-x-0 justify-center rounded-full !tracking-normal"
          >
            {confirmTeamLoading ? (
              <Spinner intent={"white"} size={"small"} />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            className="bodyFont !skew-x-0 justify-center rounded-full !tracking-normal"
            size={"small"}
            intent={"ghost"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseModal();
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmTeamModal;
