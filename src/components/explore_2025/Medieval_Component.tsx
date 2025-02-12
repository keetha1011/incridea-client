import React, { Suspense, useState, useEffect } from "react";
import * as UIButtons from "~/components/explore_2025/UI";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Sky } from "@react-three/drei";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Map } from "~/components/explore_2025/Map";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import { CharacterController } from "~/components/explore_2025/characterController";
import { Portal } from "./Portal";
import Poi from "./Stone";

const maps = {
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, -3, -6],
    rotation: [10, 0],
  },
};

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "jump", keys: ["Space"] },
];

export const Experience = () => {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined"
      ? window.innerWidth > window.innerHeight
      : true,
  );

  const [isRunOn, setIsRunOn] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-[100vh]">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 0, 0],
            near: 0.01,
            fov: isLandscape ? 60 : 100,
          }}
          className="absolute inset-0"
          gl={{ antialias: false, pixelRatio: 0.1 }}
          id="canvas"
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#ffffff"]} />
            <fog attach="fog" args={["white", 3, 40]} />
            <Physics key="medieval_fantasy_book">
              <ambientLight intensity={0.5} />
              <directionalLight
                intensity={3}
                castShadow
                position={[-5, 20, -15]}
                shadow-mapSize-width={isLandscape ? 1024 : 512}
                shadow-mapSize-height={isLandscape ? 1024 : 512}
                shadow-bias={-0.00005}
              >
                <OrthographicCamera
                  left={-22}
                  right={15}
                  top={10}
                  bottom={-20}
                  attach="shadow-camera"
                />
              </directionalLight>
              <Map
                scale={maps.medieval_fantasy_book.scale as never}
                position={maps.medieval_fantasy_book.position as never}
                model={`models/medieval_fantasy_book.glb` as never}
              />
              <CharacterController />
              <Portal props={undefined as never} />
            </Physics>
            <Poi />
            <Sky />
          </Suspense>

          {isLandscape && (
            <EffectComposer enableNormalPass>
              <Vignette eskil={false} offset={0.3} darkness={0.7} />
              <Bloom
                intensity={0.2}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.025}
                mipmapBlur={true}
              />
            </EffectComposer>
          )}
        </Canvas>
      </KeyboardControls>
      <div className="sticky bottom-24 w-full z-50 flex justify-between px-8 pointer-events-auto">
        <div className="flex flex-col items-center">
          <button id="w" className="mb-2 scale-[150%]">
            <UIButtons.CircleArrowUpFilled className="w-12 h-12 text-white/60" />
          </button>
          <div className="flex">
            <button id="a" className="mr-8 scale-[150%]">
              <UIButtons.CircleArrowLeftFilled className="w-12 h-12 text-white/60" />
            </button>
            <button id="s" className="mr-8 mt-16 scale-[150%]">
              <UIButtons.CircleArrowDownFilled className="w-12 h-12 text-white/60" />
            </button>
            <button id="d" className="scale-[150%]">
              <UIButtons.CircleArrowRightFilled className="w-12 h-12 text-white/60" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            id="shift"
            onClick={() => {
              setIsRunOn((prev) => !prev);
            }}
            className={`mb-12 scale-[100%] p-2 rounded-full transition-colors ${
              isRunOn ? "bg-green-950" : "bg-transparent"
            }`}
          >
            <UIButtons.Run className="w-12 h-12 text-white/60" />
          </button>
          <button id="jump" className="scale-[150%]">
            <UIButtons.CircleChevronsUpFilled className="w-12 h-12 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
};
