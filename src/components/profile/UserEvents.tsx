import { useQuery } from "@apollo/client";
import { type FC } from "react";
import EventCard from "./Event";

import { RegisterdEventsDocument } from "~/generated/generated";

const UserEvents: FC<{
  userId: string;
}> = ({ userId }) => {
  const { data: events } = useQuery(RegisterdEventsDocument);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col flex-nowrap border-2 rounded-lg bg-gradient-to-br  from-primary-900/80 via-primary-700/80 to-primary-900/80 backdrop-blur-sm border-secondary-500/50">
        <div className="text-white">
          <h1 className="text-center md:text-6xl text-4xl mt-6 font-bold">
            My Quests
          </h1>
          <div className="mx-auto border-2 border-secondary-400/80 w-fit rounded-full p-1 px-2 mt-4">
            <span className="text-lg font-semibold text-secondary-500">
              {5}
            </span>{" "}
            <span className="opacity-80">Quests left of</span>{" "}
            <span className="text-lg font-semibold text-secondary-500">
              {5}
            </span>
          </div>
        </div>
        <div className="w-full h-full md:flex justify-center items-center py-6">
          <div className="max-w-6xl w-full max-h-[65vh] overflow-y-scroll scroll-hide pb-14 flex gap-4 md:gap-y-8 justify-center flex-wrap">
            {/* cards */}
            {events?.registeredEvents.__typename ===
              "QueryRegisteredEventsSuccess" &&
              events?.registeredEvents.data.map((event, idx) => {
                return (
                  <>
                    <EventCard
                      teams={event.teams}
                      event={event}
                      userId={userId}
                    />
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserEvents;
