import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { IoIosSkipForward } from "react-icons/io";
import { SlVolumeOff, SlVolume2 } from "react-icons/sl";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

import Button from "~/components/button";

const Explore = () => {
  const router = useRouter();

  // FIXME: Just a fallback feature if autoplay doesn't work
  const [clickThru, setClickThru] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const blackScreenRef = useRef<HTMLDivElement>(null);
  const YTPlayerRef = useRef<YouTubePlayer>(null);
  const skipRef = useRef<HTMLDivElement>(null);

  const onReady: YouTubeProps["onReady"] = (e) => {
    YTPlayerRef.current = e.target;
    e.target.playVideo();
  };

  const onPlay: YouTubeProps["onPlay"] = (e) => {
    console.log(YTPlayerRef.current);
    if (blackScreenRef.current) blackScreenRef.current.style.display = "none";
    setClickThru(false);
  };

  const onPause: YouTubeProps["onPause"] = (e) => {
    e.target.playVideo();
  };

  const onEnd: YouTubeProps["onEnd"] = (e) => {
    if (blackScreenRef.current)
      blackScreenRef.current.style.display = "initial";
    router.push("/explore/level1");
  };

  const onError: YouTubeProps["onError"] = (e) => {
    if (blackScreenRef.current)
      blackScreenRef.current.style.display = "initial";
    router.push("/explore/level1");
  };

  useEffect(() => {
    setTimeout(() => {
      if (skipRef.current) skipRef.current.style.transform = "translateX(0%)";
    }, 3000);
  }, []);

  return (
    <div className="absolute h-screen w-screen overflow-hidden bg-black">
      <div
        className={`absolute z-40 h-screen w-screen ${
          clickThru ? "pointer-events-none" : "pointer-events-auto"
        }`}
      ></div>
      <button
        onClick={() => {
          if (!YTPlayerRef.current) return;
          if (YTPlayerRef.current.isMuted()) {
            YTPlayerRef.current.unMute();
            setIsMuted(false);
          } else {
            setIsMuted(true);
            YTPlayerRef.current.mute();
          }
        }}
        className="absolute right-[2vw] top-[3vh] z-50 cursor-pointer text-white"
      >
        {isMuted ? (
          <SlVolumeOff className="h-8 w-8 transition-colors duration-150" />
        ) : (
          <SlVolume2 className="h-8 w-8 transition-colors duration-150" />
        )}
      </button>
      <div
        ref={blackScreenRef}
        className="absolute z-40 flex h-screen w-screen items-center justify-center bg-black"
      >
        <Image
          src="/assets/loader/dodLogo.png"
          alt=""
          height={180}
          width={180}
          className="animate-pulse opacity-80"
        />
      </div>
      <div
        ref={skipRef}
        className="absolute -right-1 bottom-[10vh] z-50 translate-x-[110%] transition-all duration-500 ease-in hover:scale-110"
      >
        <Button
          onClick={() => {
            router.push("/explore/level1");
          }}
          size={"large"}
        >
          Skip <IoIosSkipForward />
        </Button>
      </div>
      <YouTube
        // TODO: VIDEO ID from youtube embed link
        videoId="CN_43nWXebo?si=PGZh5VT92HoLDme_"
        className="relative h-screen w-screen overflow-clip"
        iframeClassName="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-[115vw] h-[115vh]"
        style={{}}
        title={"exploreIntro"}
        loading="eager"
        opts={{
          playerVars: {
            autoplay: 1,
            showinfo: 0,
            controls: 0,
            modestbranding: 0,
            disablekb: 1,
            fs: 0,
            loop: 0,
            playsinline: 0,
            rel: 0,
            mute: 1,
          },
        }}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
      />
    </div>
  );
};

export default Explore;
