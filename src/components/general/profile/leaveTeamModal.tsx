import { useMutation } from "@apollo/client";
import React, { type FC, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import { LeaveTeamDocument } from "~/generated/generated";

const LeaveTeamModal: FC<{
  refetch: string;
  teamId: string;
}> = ({ teamId, refetch }) => {
  const [showModal, setShowModal] = useState(false);

  const [leaveTeam, { loading }] = useMutation(LeaveTeamDocument, {
    refetchQueries: [refetch],
    awaitRefetchQueries: true,
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLeave = async (teamId: string) => {
    setShowModal(false);
    const loadingToast = toast.loading("Leaving team...");
    await leaveTeam({
      variables: {
        teamId,
      },
    }).then((res) => {
      if (res.data?.leaveTeam.__typename === "MutationLeaveTeamSuccess") {
        toast.success("You've left the team!");
        toast.dismiss(loadingToast);
      } else {
        toast.error(res.data?.leaveTeam.message ?? "An error occurred");
        toast.dismiss(loadingToast);
      }
    });
  };

  return (
    <>
      <Button
        size={"small"}
        className="bodyFont mt-3 w-fit !skew-x-0 justify-center rounded-full !px-5 !tracking-normal"
        onClick={() => {
          setShowModal(true);
        }}
        intent={"primary"}
        fullWidth
      >
        Leave Team
      </Button>
      <Modal
        title={`Are you sure you want to confirm the team?`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="mt-2 px-5 text-center text-sm">
          Are you sure you want to leave the team?
        </div>
        <div className="my-5 flex justify-center gap-3">
          <Button
            size={"small"}
            onClick={async () => await handleLeave(teamId)}
            disabled={loading}
            className="bodyFont !skew-x-0 justify-center rounded-full !tracking-normal"
          >
            {loading ? <Spinner intent={"white"} size={"small"} /> : "Leave"}
          </Button>
          <Button
            size={"small"}
            intent={"ghost"}
            onClick={() => handleCloseModal()}
            className="bodyFont !skew-x-0 justify-center rounded-full !tracking-normal"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LeaveTeamModal;
