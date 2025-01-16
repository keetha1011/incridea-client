import { useEffect, useRef } from "react";

const CatGif = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const audioElement = audioRef.current;

    if (videoElement && audioElement) {
      videoElement.loop = true;
      videoElement.muted = true;
      audioElement.loop = true;

      videoElement.play().catch((error) => {
        console.error("Error playing video:", error);
      });

      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video ref={videoRef} width="100%" height="100%" autoPlay loop muted>
        <source src="/reveal/cat.mp4" type="video/mp4" />
      </video>
      <audio ref={audioRef}>
        <source src="/reveal/cat-laugh.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default CatGif;
