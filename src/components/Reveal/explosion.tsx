import { useEffect, useRef } from "react";

const Explosion = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.loop = true;

      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, []);

  return (
    <div>
      <audio ref={audioRef}>
        <source src="/reveal/explosion.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default Explosion;
