import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, type FC } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import EventCard from "./Event";
import Image from "next/image";

import Spinner from "~/components/spinner";
import { RegisterdEventsDocument } from "~/generated/generated";
import LeaderBoard from "./LeaderBoard";

const UserEvents: FC<{
  userId: string;
}> = ({ userId }) => {
  const { data: events, loading, error } = useQuery(RegisterdEventsDocument);

  useEffect(() => {
    console.log(events?.registeredEvents.data);
  }, [events]);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full h-full flex flex-col flex-nowrap border-2 rounded-lg bg-gradient-to-b from-primary-950/70 via-primary-800/70 to-primary-950/70 backdrop-blur-sm border-secondary-900/50">
        <div className="text-white">
          <h1 className="text-center md:text-6xl text-4xl mt-6 font-bold">
            My Quests
          </h1>
          <div className="mx-auto border-2 border-secondary-900/50 w-fit rounded-full p-1 px-2 mt-4">
            <span className="text-lg font-semibold text-secondary-600">
              {5}
            </span>{" "}
            <span className="opacity-70">Quests left of</span>{" "}
            <span className="text-lg font-semibold text-secondary-600">
              {5}
            </span>
          </div>
        </div>
        <div className="w-full h-full">
          {/* cards */}
          {/* {events?.registeredEvents.data.map((event, idx) => {
            return (
              <Image src="/test.jpg" alt="img" key={idx} className="w-[20vw]" width={100} height={100}/>
            )
          })} */}
        </div>
      </div>
    </section>
  );
};

export default UserEvents;
