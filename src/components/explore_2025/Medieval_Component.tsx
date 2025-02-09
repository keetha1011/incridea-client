import React, { Suspense, useState, useEffect } from "react";
import * as UIButtons from "~/components/explore_2025/UI";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
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
                scale={maps.medieval_fantasy_book.scale as never}
                position={maps.medieval_fantasy_book.position as never}
                model={`models/medieval_fantasy_book.glb` as never}
              />
              <CharacterController />
              <Portal props={undefined as never} />
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
      <div className="absolute z-50 transform left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="bg-transparent accent-green-950/90 scale-[200%]">
          <UIButtons.CircleArrowUpFilled id="w" className="w-10 h-10" />
          <UIButtons.CircleChevronsUpFilled id="jump" className="w-10 h-10" />
          <UIButtons.Run id="shift" className="w-10 h-10" />
          <UIButtons.CircleArrowLeftFilled id="d" className="w-10 h-10" />
          <UIButtons.CircleArrowRightFilled id="a" className="w-10 h-10" />
          <UIButtons.CircleArrowDownFilled id="s" className="w-10 h-10" />
        </div>
      </div>
      {/* <div
        className="sticky bottom-0 flex z-50 w-full items-end justify-end"
        style={
          {
            // opacity: scrollY > window.innerHeight * 0.5 ? 0.5 : 0,
            // pointerEvents: scrollY > window.innerHeight * 0.5 ? "all" : "none",
            // transition: "opacity 0.5s ease-in-out z-10"
          }
        }>
        <svg
          width="205"
          height="150"
          viewBox="0 0 1222 888"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none mb-8 mr-8">
          <g id="Right" className="pointer-events-auto z-10 select-none">
            <g id="Rectangle 6" filter="url(#filter0_b_95_21)">
              <rect
                x="808"
                y="495"
                width="414"
                height="392"
                rx="40"
                fill="white"
              />
              <rect
                x="808.5"
                y="495.5"
                width="413"
                height="391"
                rx="39.5"
                stroke="black"
              />
            </g>
            <path
              id="Polygon 7"
              d="M1110.02 686.3C1115.71 690.343 1115.62 698.824 1109.84 702.735L965.084 800.648C958.4 805.169 949.389 800.319 949.482 792.25L951.776 593.116C951.869 585.047 960.989 580.405 967.567 585.08L1110.02 686.3Z"
              fill="black"
            />
          </g>
          <g id="Up" className="pointer-events-auto z-10 select-none">
            <g id="Rectangle 6_2" filter="url(#filter1_b_95_21)">
              <rect
                x="416"
                y="414"
                width="414"
                height="392"
                rx="40"
                transform="rotate(-90 416 414)"
                fill="white"
              />
              <rect
                x="416.5"
                y="413.5"
                width="413"
                height="391"
                rx="39.5"
                transform="matrix(0 -1 1 0 3 830)"
                stroke="black"
              />
            </g>
            <path
              id="Polygon 7_2"
              d="M607.3 111.976C611.343 106.286 619.824 106.383 623.735 112.165L721.648 256.916C726.169 263.6 721.319 272.611 713.25 272.518L514.116 270.224C506.047 270.131 501.405 261.011 506.08 254.433L607.3 111.976Z"
              fill="black"
            />
          </g>
          <g id="Left" className="pointer-events-auto z-10 select-none">
            <g id="Rectangle 7" filter="url(#filter2_b_95_21)">
              <rect
                x="416.155"
                y="884.994"
                width="414"
                height="392"
                rx="40"
                transform="rotate(179.684 416.155 884.994)"
                fill="white"
              />
              <rect
                x="415.652"
                y="884.497"
                width="413"
                height="391"
                rx="39.5"
                transform="rotate(179.684 415.652 884.497)"
                stroke="black"
              />
            </g>
            <path
              id="Polygon 8"
              d="M113.08 695.362C107.368 691.351 107.419 682.869 113.179 678.927L257.387 580.217C264.047 575.659 273.084 580.46 273.036 588.529L271.84 787.673C271.791 795.742 262.697 800.434 256.093 795.796L113.08 695.362Z"
              fill="black"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_95_21"
              x="804"
              y="491"
              width="422"
              height="400"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_95_21"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_95_21"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_b_95_21"
              x="412"
              y="-4"
              width="400"
              height="422"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_95_21"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_95_21"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_b_95_21"
              x="-3.78027"
              y="489.22"
              width="423.715"
              height="401.837"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_95_21"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_95_21"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div> */}
    </div>
  );
};
