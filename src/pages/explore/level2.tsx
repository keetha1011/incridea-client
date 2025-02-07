import { Experience } from "~/components/explore_2025/pages/Medieval_Component";
import ExploreNav from "~/components/explore/exploreNav";
import AudioPlayer from "~/components/explore/audioPlayer";
import { useRef, useState, useEffect } from "react";

function Medieval() {
  const [isMuted, setIsMuted] = useState(() => {
    const savedState = typeof window !== "undefined" ? localStorage.getItem("isMuted") : null;
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  const mainThemeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem("isMuted", JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    if (mainThemeAudioRef.current) {
      if (isMuted) {
        mainThemeAudioRef.current.pause();
      } else {
        mainThemeAudioRef.current.play();
      }
    }
  }, [isMuted]);

  return (
    <div className="h-screen w-screen relative">
      <AudioPlayer
        mainThemeAudioRef={mainThemeAudioRef}
        mainTheme={`/2025/assets/explore/audio/level2.mp3`}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      ></AudioPlayer>
      <ExploreNav />
      <Experience />
    </div>
  );
}

export default Medieval;
