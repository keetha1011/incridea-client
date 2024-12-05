import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoIosPlayCircle } from "react-icons/io";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";

import { env } from "~/env";
import { type PublishedEventsQuery } from "~/generated/generated";
import { generateEventUrl } from "~/utils/url";

const Event = ({
  data,
}: {
  data: PublishedEventsQuery["publishedEvents"][0];
}) => {
  const router = useRouter();
  const getEventAttributes = () => {
    let teamSizeText = "",
      eventTypeText = "";
    if (data.minTeamSize === data.maxTeamSize) {
      if (data.minTeamSize === 1)
        teamSizeText += `${data.minTeamSize} member per team`;
      else teamSizeText += `${data.minTeamSize} members per team`;
      if (data.minTeamSize === 0) teamSizeText = "";
    } else {
      teamSizeText = `${data.minTeamSize} - ${data.maxTeamSize} members per team`;
    }

    if (data.eventType.includes("MULTIPLE")) {
      eventTypeText =
        data.eventType.split("_")[0]![0] +
        data.eventType.split("_")[0]!.slice(1).toLowerCase() +
        " (Multiple Entry)";
    } else
      eventTypeText = data.eventType[0] + data.eventType.slice(1).toLowerCase();

    eventTypeText = eventTypeText.replaceAll("Individual", "Solo");
    eventTypeText = eventTypeText.replaceAll("Team", "Multiplayer");

    return [
      {
        name: "Date",
        text: data.rounds[0]?.date
          ? new Date(data.rounds[0]?.date).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          : "TBD",
        Icon: IoCalendarOutline,
      },
      {
        name: "Type",
        text: eventTypeText,
        Icon: IoPersonOutline,
      },
      {
        name: "Venue",
        text: data.venue,
        Icon: IoLocationOutline,
      },
      {
        name: "Team Size",
        text: teamSizeText,
        Icon: IoPeopleOutline,
      },
    ];
  };

  return (
    <div
      data-scroll
      onClick={() => router.push(generateEventUrl(data.name, data.id))}
      className={`relative mx-auto flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-primary-200/70 bg-primary-500 px-2 py-2 transition-transform duration-300 hover:scale-[1.02]`}
    >
      <div>
        <div className="rounded-t-xl bg-[#f648ae]">
          <div className="w-full">
            <div className="absolute left-0 flex w-1/2 -translate-y-1 -skew-x-[37deg] justify-start rounded-bl-3xl rounded-br-xl bg-primary-500 px-4 py-[0.015rem]">
              <Image
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
                alt={"Incridea Logo"}
                width={550}
                height={550}
                className="z-0 h-8 w-16 skew-x-[37deg] object-fill text-white"
              />
            </div>
            <div
              className={`flex justify-end pr-2 pt-1 font-extrabold uppercase tracking-wider text-secondary-900`}
            >
              {data.category?.toLowerCase() === "non_technical"
                ? "Non Tech"
                : data.category?.toLocaleLowerCase()}
            </div>
          </div>
        </div>
        <div className="right-0 items-end justify-end rounded-b-xl rounded-tl-xl bg-gradient-to-b from-[#f648ae] to-[#d41b8f]">
          <div className={`rounded-xl object-fill p-2`}>
            {data.image && (
              <Image
                // src={`https://res.cloudinary.com/dqy4wpxhn/image/upload/v1682653090/Events/VOCAL_TWIST_%28WESTERN%29_1682653088345.jpg`}
                src={data.image}
                alt={data.name}
                width={250}
                height={250}
                className="z-0 h-full w-full rounded-xl object-fill text-white"
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-center font-VikingHell text-2xl text-white">
        {data.name}
      </div>
      <div className="flex h-[9rem] w-full flex-col items-start justify-center gap-2 px-1 py-3 text-white md:w-full">
        {getEventAttributes().map((attr, i) =>
          attr.name ? (
            <div
              className="flex w-full items-center gap-2 rounded-full border border-secondary-400/40 bg-primary-200/30 p-1 px-2 text-left"
              key={i}
            >
              <attr.Icon />
              {/* hyd warning due to toLocaleString()
                safe to ignore - https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning */}
              <span suppressHydrationWarning className="truncate text-sm">
                {attr.text}
              </span>
            </div>
          ) : null,
        )}
      </div>
      <div className="w-full">
        <Link href={generateEventUrl(data.name, data.id)}>
          <button className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-secondary-800 to-secondary-600 py-2 font-VikingHell text-lg capitalize tracking-wider text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-125">
            <IoIosPlayCircle />
            Play
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Event;
