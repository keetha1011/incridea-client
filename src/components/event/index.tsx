import { Calendar, MapPin, Users } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

import { env } from "~/env";
import { type PublishedEventsQuery } from "~/generated/generated";
import { generateEventUrl } from "~/utils/url";
import Image from "next/image";

const Event = ({
  data,
}: {
  data: PublishedEventsQuery["publishedEvents"][0];
}) => {
  const router = useRouter();
  const getEventAttributes = () => {
    let teamSizeText = "",
      eventTypeText = "";

    // Team Size Formatting
    if (data.minTeamSize === data.maxTeamSize) {
      if (data.minTeamSize === 1) teamSizeText = "Solo";
      else teamSizeText = `${data.minTeamSize} per Team`;
      if (data.minTeamSize === 0) teamSizeText = "";
    } else {
      teamSizeText = `${data.minTeamSize}-${data.maxTeamSize} per Team`;
    }

    // Event Type Formatting
    if (data.eventType.includes("MULTIPLE")) {
      eventTypeText = "Multi";
    } else {
      eventTypeText =
        data.eventType.split("_")[0]![0] +
        data.eventType.split("_")[0]!.slice(1).toLowerCase();
    }

    // Correctly format multiple entry
    const eventTypeWithTeamSize = `${eventTypeText} : ${teamSizeText}`;

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
        Icon: Calendar,
      },
      {
        name: "Type & Team Size",
        text: eventTypeWithTeamSize,
        Icon: Users,
      },
      {
        name: "Venue",
        text: data.venue,
        Icon: MapPin,
      },
    ];
  };

  return (
    <div
      data-scroll
      onClick={() => router.push(generateEventUrl(data.name, data.id))}
      className={`relative flex w-full max-w-[80%] sm:max-w-sm md:max-w-md cursor-pointer flex-col mb-28 rounded-2xl transition-transform duration-300 hover:scale-[1.02] sm:mt-10 md:mt-20 mx-auto sm:mx-0`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 145.68 242.61"
        className="w-full h-full object-cover rounded-2xl"
        style={{ transform: "scale(1)" }}
      >
        <defs>
          <style>{`
                .b {
                  fill: url(#gradient1);
                }
                .e {
                  fill:url(#gradient2);
                }
              `}</style>
        </defs>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "rgba(255, 255, 255, 0.2)" }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "rgba(255, 255, 255, 0.3)" }}
            />
          </linearGradient>

          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#8B6F43" }} />
            <stop offset="100%" style={{ stopColor: "#D4AF37" }} />
          </linearGradient>
        </defs>

        <polygon
          className="b"
          points="13.1 242.61 13.07 242.61 12.78 242.29 13.06 242.57 13.1 242.61"
        />
        <path
          className="b"
          d="M145.68,228.35h-.01s.01,1.31.01,1.31v3.19l-9.8,9.76H13.1l-.04-.04-.28-.28.29.32h-3.3l-9.77-9.76v-3.14h.05l-.05-.05v-74.55l13.07-13.07v-53L0,77.65V16.23l6.11-6.27L15.8,0h39.14l10.01,9.96h66.46l6.22,6.27,4.07,4.07c.11.11.22.22.3.34l.16.17,3.52,3.53v204.01Z"
        />
        <polygon
          className="b"
          points="13.1 242.61 13.07 242.61 12.78 242.29 13.06 242.57 13.1 242.61"
        />

        <foreignObject x="0" y="86" width="17" height="60">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-[#E6C98D] italic font-semibold text-[8px] uppercase transform origin-center -rotate-90 whitespace-nowrap  px-2 shadow-2xl rounded-xl">
              {data.category?.toLowerCase() === "non_technical"
                ? "Non Tech"
                : data.category?.toLocaleLowerCase()}
            </span>
          </div>
        </foreignObject>

        <image
          href={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
          x="21"
          y="-8"
          width="30"
          height="30"
          className="object-cover z-500"
        />

        <foreignObject x="19" y="18.5" width="120" height="123">
          {data.image && (
            <Image
              src={data.image}
              alt={data.name}
              layout="fill"
              className="object-cover rounded-tr-2xl [clip-path:polygon(0_0,90%_0,100%_10%,100%_100%,0_100%)]"
            />
          )}
        </foreignObject>

        <foreignObject x="-2" y="140" width="150" height="102">
          <div className="text-white flex flex-col w-full items-center justify-center">
            <h2 className="text-base ml-2 font-life-craft my-1 text-center italic text-primary-950">
              {data.name}
            </h2>
            <div className="grid grid-cols-1 gap-x-1 gap-y-1 w-full px-2 items-start -mt-1.5">
              {getEventAttributes().map((attr, i) => (
                <div
                  key={i}
                  className="flex items-center justify-start h-3.5 text-[6px] gap-1 rounded-md px-2 py-[7px] bg-gradient-to-tr from-[#8B6F43] via-[#D4AF37] to-[#8B6F43] border border-[#D4AF37]/60 text-[#FFF4C2] font-medium shadow-md"
                >
                  <attr.Icon
                    width="7"
                    height="7"
                    className="flex items-center justify-start"
                  />
                  <span
                    className="flex items-center leading-[0.7rem] h-full w-full"
                    suppressHydrationWarning
                  >
                    {attr.text}
                  </span>
                </div>
              ))}
            </div>
            <a href={generateEventUrl(data.name, data.id)} className="-mt-0.5">
              <svg width="145" height="30" viewBox="32 232 165 40">
                <g transform="translate(-15, -1)">
                  <polyline
                    className="e"
                    points="34.71 251 50.11 261 208.6 261 224.04 251"
                  />
                  <polyline
                    className="e"
                    points="50.16 243 34.71 251 224.04 251 208.64 243"
                  />
                  <text
                    x="128"
                    y="256"
                    className="text-[#E6C98D] italic font-semibold text-[12px] uppercase cursor-pointer"
                    textAnchor="middle"
                    fill="#E6C98D"
                  >
                    Register
                  </text>
                </g>
              </svg>
            </a>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default Event;
