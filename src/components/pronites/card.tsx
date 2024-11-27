import Image from "next/image";
import { IoMdMicrophone } from "react-icons/io";

type ProniteCardProps = {
  artist: {
    name: string;
    time: string;
    imageSrc: string;
  };
  isArtist: boolean;
  gradient: "blue" | "pink";
};

export default function ProniteCard({
  artist,
  isArtist,
  gradient,
}: ProniteCardProps) {
  return (
    <>
      <div
        style={{
          opacity: isArtist ? 1 : 0,
          transition: "opacity 1.5s",
        }}
        className="pointer-events-none absolute bottom-6 right-6 z-50 w-[210px] rounded-[14px] text-white md:bottom-10 md:right-10 md:w-[300px]"
      >
        <Image
          src={artist.imageSrc}
          alt={artist.name}
          fill={true}
          className="-z-50 rounded-[14px] object-cover"
        />
        <div
          className={`absolute bg-gradient-to-tr ${
            gradient === "pink"
              ? "from-[#bc43a2] to-[#e18472]"
              : "from-[#5143bc] to-[#72bee1]"
          } -z-50 h-full w-full rounded-[14px] opacity-70`}
        ></div>
        <div className="z-50 p-2 md:p-3">
          <div className="flex h-16 items-center opacity-90 md:h-20">
            <IoMdMicrophone className="ml-2" size={"3rem"} />
          </div>
          <div className="flex flex-col p-2">
            <div className="text-xl font-medium md:text-2xl">{artist.name}</div>
            <div className="opacity-70">{artist.time}</div>
          </div>
        </div>
      </div>
    </>
  );
}
