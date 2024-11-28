import dynamic from "next/dynamic";
import Image from "next/image";

import Reveal from "./reveal";
import ScrollLag from "./scrollLag";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type BannerProps = {
  video?: string;
  photo?: string;
  text: string;
  credits?: string;
};

const Banner: React.FC<BannerProps> = ({ photo, text, video, credits }) => {
  return (
    <div className="relative h-80 w-full shrink-0 overflow-hidden">
      {photo && (
        <div className="absolute inset-0">
          <Image
            src={photo}
            alt="Banner"
            fill
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            priority
          />
        </div>
      )}
      {video && (
        <div className="absolute flex h-full w-full items-center justify-stretch md:h-screen md:max-h-[525px] md:min-h-[396px] lg:h-screen lg:max-h-[640px] lg:min-h-[620px] xl:h-screen xl:max-h-[780px] xl:min-h-[720px] 2xl:h-[800px]">
          <ReactPlayer
            url={video}
            playing
            loop
            muted
            controls={false}
            width="100%"
            height="100%"
          />
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <ScrollLag classes="mb-10 lg:mb-44" speed={200}>
          <Reveal classes="">
            <div className={`text-center text-4xl font-black lg:text-7xl`}>
              {text}
            </div>
          </Reveal>
        </ScrollLag>
      </div>
    </div>
  );
};

export default Banner;
