import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";

import Button from "~/components/button";
import { TextInput } from "~/components/input";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { CreateJudgeDocument } from "~/generated/generated";

const CreateJudgeModal: FC<{
  eventId: string;
  roundNo: number;
}> = ({ eventId, roundNo }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [createJudgeMutation, { loading: createJudgeLoading }] =
    useMutation(CreateJudgeDocument);

  const handleCreateJudge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const promise = createJudgeMutation({
      variables: {
        name,
        email,
        password,
        eventId,
        roundNo,
      },
      refetchQueries: ["EventByOrganizer"],
    }).then((res) => {
      if (res.data?.createJudge.__typename === "MutationCreateJudgeSuccess") {
        handleCloseModal();
      } else throw new Error("Error creating judge");
    });
    await createToast(promise, `Adding Judge '${name}'...`);
  };

  return (
    <div className="mt-5">
      <Button
        onClick={() => {
          setShowModal(true);
        }}
      >
        Create Judge
      </Button>
      <Modal
        title="Create Judge"
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div
          className={`p-5 ${
            createJudgeLoading &&
            "pointer-events-none cursor-not-allowed opacity-50"
          }`}
        >
          {/* Name, Email, Password */}
          <form className="flex flex-col gap-5" onSubmit={handleCreateJudge}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <TextInput name="name" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <TextInput
                name="email"
                type={"email"}
                placeholder="admin@incridea.in"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <TextInput
                name="password"
                type={"password"}
                placeholder="*********"
              />
            </div>
            <div className="flex justify-end">
              <Button className="rounded-lg" type="submit">
                {createJudgeLoading ? (
                  <>
                    <Spinner intent={"white"} size={"small"} />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateJudgeModal;
