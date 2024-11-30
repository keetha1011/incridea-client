import { useMutation } from "@apollo/client";
import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import AudioPlayer from "~/components/explore/audioPlayer";
import ExploreNav from "~/components/explore/exploreNav";
import { env } from "~/env";
import { AddXpDocument } from "~/generated/generated";

const Scene2 = dynamic(() => import("~/components/scene2"), {
  ssr: false,
});

export default function Level3() {
  const mainThemeAudioRef = useRef<HTMLAudioElement>(null);
  const [muted, setIsMuted] = useState(true);
  const [calledXp, setCalledXp] = useState(false);

  const [instruction, setInstruction] = useState<boolean>(true);
  const stack = ["4", "f", "r", "f", "h"];

  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "6",
    },
    refetchQueries: ["GetUserXp"],
    awaitRefetchQueries: true,
  });

  const handleAddXp = () => {
    if (calledXp) {
      return;
    }
    setCalledXp(true);
    const promise = addXp().then((res) => {
      if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
        toast.success(
          `Congratulations!!! You have found ${res.data?.addXP.data.level.point} Xp`,
          {
            position: "bottom-center",
            style: {
              backgroundColor: "#7628D0",
              color: "white",
            },
          },
        );
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      //check if the key 4,f,r,f,h is pressed
      if (event.key === stack[0]) {
        stack.shift();
        if (stack.length === 0) {
          //add mutation here for xp points
          handleAddXp();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full overflow-y-scroll">
      <AudioPlayer
        mainThemeAudioRef={mainThemeAudioRef}
        mainTheme={`${env.NEXT_PUBLIC_BASE_AUDIO_URL}/audio/level3/main.mp3`}
        isMuted={muted}
        setIsMuted={setIsMuted}
      />
      <ExploreNav />
      <Canvas>
        <directionalLight
          color={"#ffb647"}
          position={[500, 500, 500]}
          intensity={2}
        />
        <color args={["#333"]} attach={"background"} />
        <ambientLight intensity={0.5} />
        <ScrollControls maxSpeed={0.25} pages={5}>
          <Scene2
            isMuted={muted}
            setIsMuted={setIsMuted}
            setInstruction={setInstruction}
          />
        </ScrollControls>
      </Canvas>
      {instruction && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[100] -translate-x-1/2 animate-pulse text-base font-semibold text-white transition-all duration-300 md:text-lg 2xl:text-xl">
          Scroll down to explore
        </div>
      )}
    </div>
  );
}
