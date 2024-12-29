import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import Button from "~/components/button";
import { TextInput, DateTimeInput } from "~/components/input";
import { SettingsIcon } from "lucide-react";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import toast from "react-hot-toast";
import { CreateQuizDocument } from "~/generated/generated";
import Link from "next/link";
import test from "node:test";

const CreateQuizModal: FC<{
  testing: string; // for testing
  eventId: string;
  roundNo: number;
  quizDetails?: {
    quizId: string; // for testing
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    password: string;
  } | null;
}> = ({ testing, eventId, roundNo, quizDetails }) => {
  // for testing
  const formatDate = (date: string): string => {
    const gmtDate = new Date(date + "Z");
    const localYear = gmtDate.getFullYear();
    const localMonth = String(gmtDate.getMonth() + 1).padStart(2, "0");
    const localDate = String(gmtDate.getDate()).padStart(2, "0");
    const localHours = String(gmtDate.getHours()).padStart(2, "0");
    const localMinutes = String(gmtDate.getMinutes()).padStart(2, "0");
    return `${localYear}-${localMonth}-${localDate}T${localHours}:${localMinutes}`;
  };

  const [showModal, setShowModal] = useState(false);
  const [quizInfo, setQuizInfo] = useState({
    name: quizDetails?.name ?? "",
    description: quizDetails?.description ?? "",
    startTime: quizDetails?.startTime ? formatDate(quizDetails?.startTime) : "",
    endTime: quizDetails?.endTime ? formatDate(quizDetails?.endTime) : "",
    password: quizDetails?.password ?? "",
  });

  const [createQuiz, { loading }] = useMutation(CreateQuizDocument);

  const isFormChanged = quizDetails
    ? JSON.stringify(quizInfo) !==
      JSON.stringify({
        name: quizDetails.name,
        description: quizDetails.description,
        startTime: formatDate(quizDetails.startTime),
        endTime: formatDate(quizDetails.endTime),
        password: quizDetails.password,
      })
    : !!quizInfo.name &&
      !!quizInfo.startTime &&
      !!quizInfo.endTime &&
      !!quizInfo.password;

  const disabled = loading || !isFormChanged;

  const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (new Date(quizInfo.startTime) > new Date(quizInfo.endTime)) {
      toast.error("Start time cannot be greater than end time", {
        duration: 5000,
      });
      return;
    }

    const promise = createQuiz({
      variables: {
        quizDescription: quizInfo.description,
        endTime: quizInfo.endTime,
        eventId,
        quizTitle: quizInfo.name,
        startTime: quizInfo.startTime,
        roundId: String(roundNo),
        password: quizInfo.password,
      },
      refetchQueries: ["EventByOrganizer"],
      awaitRefetchQueries: true,
    })
      .then((res) => {
        if (res.data?.createQuiz.__typename === "MutationCreateQuizSuccess") {
          setShowModal(false);
        } else {
          throw new Error(
            res.data?.createQuiz.message ?? "Error creating quiz",
          );
        }
      })
      .catch(async (err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        await createToast(Promise.reject(error), "Failed to create quiz");
      });

    await createToast(
      promise,
      quizDetails ? "Editing Quiz..." : "Adding Quiz...",
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-5">
      {quizDetails ? (
        <SettingsIcon
          onClick={() => setShowModal(true)}
          className="absolute right-0 top-0 m-4 cursor-pointer"
        />
      ) : (
        <Button onClick={() => setShowModal(true)} className="mt-5">
          Create Quiz
        </Button>
      )}
      <Modal
        title={`Create Quiz`}
        showModal={showModal}
        onClose={() => setShowModal(false)}
        size="medium"
      >
        <div
          className={`p-5 ${
            loading && "pointer-events-none cursor-not-allowed opacity-50"
          }`}
        >
          <form className="flex flex-col gap-5" onSubmit={handleCreateQuiz}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Quiz Name</label>
              <TextInput
                name="name"
                placeholder="Enter quiz name"
                value={quizInfo.name}
                disabled={loading}
                onChange={handleChange}
              />
              <label htmlFor="description">Quiz Description (Optional)</label>
              <TextInput
                name="description"
                placeholder="Enter quiz description"
                value={quizInfo.description}
                disabled={loading}
                onChange={handleChange}
              />
              <label htmlFor="password">Quiz Password</label>
              <TextInput
                name="password"
                placeholder="Enter quiz password"
                value={quizInfo.password}
                disabled={loading}
                onChange={handleChange}
              />
              <label htmlFor="startTime">Start Time</label>
              <DateTimeInput
                name="startTime"
                placeholder="Start Time"
                value={quizInfo.startTime}
                disabled={loading}
                onChange={handleChange}
              />
              <label htmlFor="endTime">End Time</label>
              <DateTimeInput
                name="endTime"
                placeholder="End Time"
                value={quizInfo.endTime}
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end">
              <Button intent={"ghost"} className="w-auto">
                <Link
                  href={`${testing}/${quizDetails?.quizId}`} // for testing
                >
                  TEST QUIZ
                </Link>
              </Button>
              <Button className="rounded-lg" type="submit" disabled={disabled}>
                {loading ? (
                  <>
                    <Spinner intent={"white"} size={"small"} />
                    {quizDetails ? "Editing..." : "Creating..."}
                  </>
                ) : quizDetails ? (
                  "Edit"
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

export default CreateQuizModal;
