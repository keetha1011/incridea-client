import { useMutation } from "@apollo/client";
import { Tab } from "@headlessui/react";
import { type FC, useState } from "react";
import { BiLoaderAlt, BiTrash } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import Button from "~/components/button";
import createToast from "~/components/toast";
import {
  DeleteCriteriaDocument,
  DeleteJudgeDocument,
  DeleteRoundDocument,
  type EventByOrganizerQuery,
} from "~/generated/generated";

import CreateCriteriaModal from "./createCriteriaModal";
import CreateJudgeModal from "./createJudgeModal";
import RoundAddModal from "./roundsAddModal";

const RoundsSidebar: FC<{
  rounds: EventByOrganizerQuery["eventByOrganizer"][0]["rounds"];
  eventId: string;
  isPublished: boolean;
}> = ({ rounds, eventId, isPublished }) => {
  const [deleteRound, { loading: loading2 }] = useMutation(
    DeleteRoundDocument,
    {
      refetchQueries: ["EventByOrganizer"],
      variables: {
        eventId: eventId,
      },
      awaitRefetchQueries: true,
    },
  );

  const [deleteJudge, { loading: deleteJudgeLoading }] = useMutation(
    DeleteJudgeDocument,
    {
      refetchQueries: ["EventByOrganizer"],
      awaitRefetchQueries: true,
    },
  );

  const [deleteCriteria, { loading: deleteCriteriaLoading }] = useMutation(
    DeleteCriteriaDocument,
    {
      refetchQueries: ["EventByOrganizer"],
      awaitRefetchQueries: true,
    },
  );

  const [selectedRound, setSelectedRound] = useState(1);

  const handleDeleteRound = async () => {
    const promise = deleteRound();
    await createToast(promise, "Deleting round...");
  };

  const handleDeleteJudge = async (id: string) => {
    const promise = deleteJudge({
      variables: {
        eventId: eventId,
        roundNo: selectedRound,
        userId: id,
      },
    });
    await createToast(promise, "Deleting judge...");
  };

  const handleDeleteCriteria = async (id: string) => {
    const promise = deleteCriteria({
      variables: {
        eventId: eventId,
        roundNo: selectedRound,
        criteriaId: id,
      },
    });
    await createToast(promise, "Deleting criteria...");
  };

  return (
    <div className="flex flex-col gap-5 px-2 pb-2">
      <Tab.Group>
        <Tab.List className="flex w-full flex-row items-center gap-2 overflow-x-auto rounded-2xl border border-gray-600 bg-gray-900/30 p-3 backdrop-blur-md">
          {rounds.map((round) => (
            <Tab key={round.roundNo} className="focus:outline-none md:w-full">
              {({ selected }) => (
                <button
                  onClick={() => {
                    setSelectedRound(round.roundNo);
                  }}
                  className={`w-full whitespace-nowrap rounded-lg px-3 py-2 ${
                    selected
                      ? "bg-blue-900/40 text-white"
                      : "bg-gray-600/40 text-gray-300"
                  }`}
                >
                  Round {round.roundNo}
                </button>
              )}
            </Tab>
          ))}
          <div className="flex items-end justify-center gap-2 text-xs">
            <RoundAddModal
              published={isPublished}
              eventID={eventId}
              roundNo={rounds.length}
            />
            <Button
              intent={"danger"}
              disabled={loading2 || isPublished}
              onClick={handleDeleteRound}
            >
              {loading2 ? (
                <>
                  <BiLoaderAlt className="animate-spin text-xl" />
                  Deleting...
                </>
              ) : (
                <>
                  <MdDelete className="text-xl" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </Tab.List>

        <Tab.List className="flex flex-col lg:flex-row">
          <div className="mx-2 mb-2 w-full rounded-lg bg-gray-700 p-3 lg:mb-0">
            <h1 className="text-xl font-bold">Judges</h1>
            {/* List of judges for this round */}
            {rounds.map((round) => (
              <div key={round.eventId}>
                {round.roundNo === selectedRound && (
                  <>
                    {round.judges.length === 0 ? (
                      <p className="text-gray-400">No judges added yet.</p>
                    ) : (
                      round.judges.map((judge) => (
                        <div
                          key={round.roundNo}
                          className="my-2 flex items-center justify-between rounded-lg bg-white bg-opacity-10 bg-clip-padding p-3 backdrop-blur-lg backdrop-filter"
                        >
                          <div>
                            <h1 className="text-lg font-bold">
                              {judge.user.name}
                            </h1>
                            <h1 className="text-sm text-gray-400">
                              {judge.user.email}
                            </h1>
                          </div>
                          <Button
                            intent={"danger"}
                            size="small"
                            outline
                            className="h-8 w-8"
                            onClick={async () =>
                              await handleDeleteJudge(judge.user.id)
                            }
                            disabled={deleteJudgeLoading}
                          >
                            <BiTrash />
                          </Button>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            ))}

            <CreateJudgeModal eventId={eventId} roundNo={selectedRound} />
          </div>

          <div className="mx-2 w-full rounded-lg bg-gray-700 p-3">
            <h1 className="text-xl font-bold">Criterias</h1>
            {/* List of Criterias for this round */}
            {rounds.map((round) => (
              <div key={round.eventId}>
                {round.roundNo === selectedRound && (
                  <>
                    {round.criteria?.length === 0 ? (
                      <p className="text-gray-400">No Criterias added yet.</p>
                    ) : (
                      round.criteria?.map((criteria) => (
                        <div
                          key={round.roundNo}
                          className="my-2 flex items-center justify-between rounded-lg bg-white bg-opacity-10 bg-clip-padding p-3 backdrop-blur-lg backdrop-filter"
                        >
                          <div>
                            <h1 className="text-lg font-bold">
                              {criteria.name}
                            </h1>
                            <h1 className="text-sm text-gray-400">
                              {criteria.type}
                            </h1>
                          </div>
                          <Button
                            intent={"danger"}
                            size="small"
                            outline
                            className="h-8 w-8"
                            onClick={async () =>
                              await handleDeleteCriteria(criteria.id)
                            }
                            disabled={deleteCriteriaLoading}
                          >
                            <BiTrash />
                          </Button>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            ))}

            <CreateCriteriaModal eventId={eventId} roundNo={selectedRound} />
          </div>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default RoundsSidebar;
