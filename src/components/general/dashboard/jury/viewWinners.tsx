import { useQuery, useMutation } from "@apollo/client";
import {
  WinnersByEventDocument,
  SendWinnerWhatsAppNotificationDocument,
} from "~/generated/generated";
import { idToTeamId } from "~/utils/id";
import createToast from "~/components/toast";
import Button from "~/components/button";
import { BiLoaderAlt } from "react-icons/bi";

import ViewTeamModal from "./viewTeamModal";

const ViewWinners = ({ eventId }: { eventId: string }) => {
  const { data: winners, loading: winnersLoading } = useQuery(
    WinnersByEventDocument,
    {
      variables: {
        eventId: eventId,
      },
      skip: !eventId,
    },
  );

  const [sendNotification, { loading: notifyLoading }] = useMutation(
    SendWinnerWhatsAppNotificationDocument,
    {
      variables: { eventId },
    },
  );

  const handleNotifyWinners = async () => {
    const promise = sendNotification().then((response) => {
      const message = response.data?.sendWinnerWhatsAppNotification;
      if (!message || message.__typename === "Error") {
        throw new Error("Failed to send notifications");
      }
      if (message.data.includes("already sent")) {
        throw new Error(
          "Notifications were already sent for this event winners",
        );
      }
      if (message.data.includes("Failed")) {
        throw new Error(message.data);
      }
      return message;
    });

    try {
      await createToast(promise, "Sending notifications...");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      await createToast(
        Promise.reject(error),
        "Sending notifications...",
        error.message,
      );
    }
  };

  return (
    <div>
      {winnersLoading && <div>Loading...</div>}
      {!winners && <div>No winners yet</div>}
      <>
        <div
          className={`mb-2 flex items-center rounded-lg bg-white/10 p-2 px-5`}
        >
          <div className="flex w-full flex-row gap-5">
            <div className={`basis-1/4 text-white/80`}>Name</div>
            <div className={`basis-1/4 text-white/80`}>ID</div>
            <div className={`basis-1/4 text-white/80`}>Type</div>
            <div className={`basis-1/4 text-white/80`}>View Team</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {winners?.winnersByEvent.__typename ===
            "QueryWinnersByEventSuccess" &&
            winners?.winnersByEvent.data.map((winner) => {
              return (
                <div
                  key={winner.id}
                  className={`flex items-center rounded-lg bg-white/10 p-2 px-5`}
                >
                  <div className="flex w-full flex-row gap-5">
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.team.name}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {idToTeamId(winner.team.id)}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.type}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      <ViewTeamModal
                        teamId={winner.team.id}
                        teamName={winner.team.name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleNotifyWinners}
            disabled={notifyLoading}
            className="flex items-center justify-center gap-2 mx-auto"
          >
            {notifyLoading ? (
              <BiLoaderAlt className="animate-spin" />
            ) : (
              "Notify Winners"
            )}
          </Button>
        </div>
      </>
    </div>
  );
};

export default ViewWinners;
