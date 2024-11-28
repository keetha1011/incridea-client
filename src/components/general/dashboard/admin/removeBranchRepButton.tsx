import { useMutation } from "@apollo/client";
import { FC } from "react";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { RemoveBranchRepDocument } from "~/generated/generated";

const RemoveBranchRepButton: FC<{
  branchId: string;
  userId: string;
}> = ({ branchId, userId }) => {
  const [showModal, setShowModal] = useState(false);

  //mutation to remove branch rep
  const [removeBranchRep, { loading }] = useMutation(RemoveBranchRepDocument, {
    refetchQueries: ["Branches"],
    awaitRefetchQueries: true,
    variables: {
      branchId: branchId,
      userId: userId,
    },
  });

  function handleRemoveBranchRep() {
    setShowModal(false);
    let promise = removeBranchRep().then((res) => {
      if (
        res.data?.removeBranchRep.__typename !==
        "MutationRemoveBranchRepSuccess"
      ) {
        if (res.data?.removeBranchRep.message !== undefined)
          createToast(
            Promise.reject(res.data?.removeBranchRep.message),
            res.data?.removeBranchRep.message,
          );
        return Promise.reject("Error could not remove branch rep");
      }
    });
    createToast(promise, "Removing BranchRep...");
  }

  return (
    <>
      <Button
        intent="danger"
        size="large"
        className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setShowModal(true)}
      >
        <IoTrash />
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        size="medium"
        title="Delete Branch Representative"
      >
        <div className="m-3 flex flex-col items-center justify-center">
          <p className="text-center">
            Are you sure you want to delete Branch Representative?
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              intent="danger"
              size="medium"
              onClick={() => handleRemoveBranchRep()}
            >
              Delete
            </Button>
            <Button
              intent="info"
              size="medium"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RemoveBranchRepButton;
