import { useQuery } from "@apollo/client";
import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import { PerspectiveCamera, SheetProvider, editable as e } from "@theatre/r3f";
import dynamic from "next/dynamic";
import scene1 from "public/assets/3d/state4.json";
import React, { Suspense, useRef, useState } from "react";

import AudioPlayer from "~/components/explore/audioPlayer";
import BookModal from "~/components/explore/bookModal";
import ExploreNav from "~/components/explore/exploreNav";
import Pokedex from "~/components/pokedex";
import useStore from "~/components/store/store";
import { env } from "~/env";
import {
  PublishedEventsDocument,
  PublishedEventsQuery,
} from "~/generated/generated";

const Scene1 = dynamic(() => import("~/components/scene1"), {
  ssr: false,
});

const demoSheet = getProject("Scene 1", { state: scene1 }).sheet("Scene 1");

const App = () => {
  const [instruction, setInstruction] = useState<boolean>(true);
  const {
    data: eventsData,
    loading: eventLoading,
    error: eventError,
  } = useQuery<PublishedEventsQuery>(PublishedEventsDocument);

  let tempFilteredEvents = eventsData?.publishedEvents;

  tempFilteredEvents = tempFilteredEvents?.filter(
    (event) => event.category === "CORE",
  );

  const events: Array<{ id: string; name: string; image: string }> =
    tempFilteredEvents?.map((event) => ({
      id: event.id,
      name: event.name || "",
      image: event.image || "",
    })) || [];

  const modalRef = useRef(null);
  const sponsorBookRef = useRef(null);
  const eventDex = useStore((state) => state.eventDex);
  const sponsor = useStore((state) => state.sponsor);

  const [isMuted, setIsMuted] = useState(true);
  const mainThemeAudioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="h-screen w-full">
      <AudioPlayer
        mainThemeAudioRef={mainThemeAudioRef}
        mainTheme={`${env.NEXT_PUBLIC_BASE_AUDIO_URL}/audio/level2/main.mp3`}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      ></AudioPlayer>
      <ExploreNav />
      <Suspense>
        <Canvas
          gl={{
            preserveDrawingBuffer: true,
          }}
          className="z-50"
        >
          <SheetProvider sheet={demoSheet}>
            <color attach={"background"} args={["#87CEEB"]} />
            <ScrollControls pages={6} maxSpeed={0.5}>
              <>
                <e.group theatreKey="cameraContainer" position={[0, 10, 0]}>
                  <PerspectiveCamera
                    theatreKey="Camera"
                    makeDefault
                    position={[0, 0, 0]}
                    rotation={[0.3, Math.PI, 0]}
                    fov={50}
                    near={0.1}
                    far={100}
                  />
                </e.group>
                <ambientLight intensity={0.5} />
                <fog attach={"fog"} args={["#87CEEB", 0.1, 100]} />
                <directionalLight
                  color={"#fff490"}
                  position={[0, 100, -100]}
                  intensity={0.5}
                />
                <Scene1 setInstruction={setInstruction} />
              </>
            </ScrollControls>
          </SheetProvider>
        </Canvas>
      </Suspense>
      <div className="" ref={modalRef}>
        {eventDex && (
          <Pokedex
            isMuted={isMuted}
            mainThemeAudioRef={mainThemeAudioRef}
            data={events}
          />
        )}
      </div>
      <div className="" ref={sponsorBookRef}>
        {sponsor && (
          <BookModal isMuted={isMuted} mainThemeAudioRef={mainThemeAudioRef} />
        )}
      </div>
      {instruction && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[100] -translate-x-1/2 animate-pulse text-base font-semibold text-white transition-all duration-300 md:text-lg 2xl:text-xl">
          Scroll down to explore
        </div>
      )}
    </div>
  );
};

export default App;
