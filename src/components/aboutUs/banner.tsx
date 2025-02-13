import dynamic from "next/dynamic";
import Image from "next/image";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type BannerProps = {
  video?: string;
  credits?: string;
};

const Banner: React.FC<BannerProps> = ({ video, credits }) => {
  return (
    <div className="relative h-80 w-full shrink-0 overflow-hidden">
      {video && (
        <div className="absolute flex md:mt-0 mt-10 h-full w-full items-center md:h-screen md:max-h-[455px] md:min-h-[296px] lg:h-screen lg:max-h-[560px] lg:min-h-[520px] xl:h-screen xl:max-h-[780px] xl:min-h-[720px] 2xl:h-[800px]">
          <ReactPlayer
            url={video}
            playing
            loop
            muted
            controls={false}
            width="100%"
            height="85%"
            style={{ objectFit: "cover", placeSelf: "center" }}
          />
        </div>
      )}
    </div>
  );
};

export default Banner;
