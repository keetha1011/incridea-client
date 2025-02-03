import { KeyboardControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Experience } from "~/components/explore_2025/pages/Medieval_Component";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import React, { Suspense, useEffect } from "react";
import { Button } from "@headlessui/react";
import ExploreNav from "~/components/explore/exploreNav";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "jump", keys: ["Space"] },
];

function Medieval() {
  return (
    <div className="h-screen w-screen relative">
      <ExploreNav />
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 0, 0],
            near: 0.1,
            fov:
              typeof window !== "undefined" &&
              window.innerHeight > window.innerWidth
                ? 100
                : 60,
          }}
          style={{
            touchAction: "none",
          }}
          gl={{ antialias: true, pixelRatio: 0.1 }}
          id="canvas"
        >
          <Suspense>
            <fog attach="fog" args={["white", 1, 20]} />
            <color attach="background" args={["#ffffff"]} />
            <Experience />
            <EffectComposer enableNormalPass>
              <Vignette eskil={false} offset={0.3} darkness={0.7} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <Button
        className="absolute bottom-10 right-10 p-4 z-50 bg-blue-500 text-white rounded-full"
        id="jump"
      >
        Jump
      </Button>
    </div>
  );
}

export default Medieval;
