import React, { Suspense, useState, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "~/components/explore_2025/controllers/characterController";
import { Map } from "~/components/explore_2025/Map";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import { Button } from "@headlessui/react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Poi from "../poi/Stone";
import { Portal } from "../Portal";

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
      : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-screen">
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
          <Suspense>
            <fog attach="fog" args={["white", 3, 40]} />
            <color attach="background" args={["#ffffff"]} />
            <Physics key="medieval_fantasy_book">
              <ambientLight intensity={0.5} />
              <directionalLight
                intensity={3}
                castShadow
                position={[-5, 20, 15]}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
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
                scale={maps.medieval_fantasy_book.scale}
                position={maps.medieval_fantasy_book.position}
                model={`models/medieval_fantasy_book.glb`}
              />
              <CharacterController />
              <Portal />
            </Physics>
            <Poi />
          </Suspense>

          {isLandscape && (
            <EffectComposer enableNormalPass>
              <Vignette eskil={false} offset={0.3} darkness={0.7} />
              <Bloom
                intensity={1.0}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.025}
                mipmapBlur={true}
              />
            </EffectComposer>
          )}
        </Canvas>
      </KeyboardControls>

      {/* Responsive Controls */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <Button
          className="p-4 sm:p-6 bg-blue-500/60 text-white rounded select-none"
          id="jump"
        >
          Jump
        </Button>
        <div className="flex gap-4">
          <Button
            className="p-3 sm:p-5 bg-blue-500/60 text-white rounded select-none"
            id="w"
          >
            W
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            className="p-3 sm:p-5 bg-blue-500/60 text-white rounded select-none"
            id="a"
          >
            A
          </Button>
          <Button
            className="p-3 sm:p-5 bg-blue-500/60 text-white rounded select-none"
            id="s"
          >
            S
          </Button>
          <Button
            className="p-3 sm:p-5 bg-blue-500/60 text-white rounded select-none"
            id="d"
          >
            D
          </Button>
        </div>
      </div>

      {/* Shift Button (Run) */}
      <Button
        className="absolute top-10 right-10 sm:top-16 sm:right-16 p-3 sm:p-5 bg-blue-500/60 text-white rounded select-none"
        id="shift"
      >
        Shift
      </Button>
    </div>
  );
};
