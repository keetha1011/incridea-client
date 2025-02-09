import React, { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";

import {
  Box,
  MeshReflectorMaterial,
  useAnimations,
  useGLTF,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import {
  Canvas,
  Euler,
  ExtendedColors,
  Layers,
  Matrix4,
  NodeProps,
  NonFunctionKeys,
  Overwrite,
  Quaternion,
  Euler,
  ExtendedColors,
  Layers,
  Matrix4,
  NodeProps,
  NonFunctionKeys,
  Overwrite,
  Quaternion,
  useFrame,
  useThree,
  Vector3,
  Vector3,
} from "@react-three/fiber";

import Image from "next/image";
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";

const videos = [
  "https://dfa33mnwg1.ufs.sh/f/esZfxOtAMiU5e5pu0j8tAMiU5yDCVdZ60BkYtmFbzGo8R9wI",

  "https://dfa33mnwg1.ufs.sh/f/esZfxOtAMiU5U1IGLYFfNs2TvG7OnkrcVp14ZImB6b3eHAK0",
];
export default function App() {
  const lightRef = useRef();

  const targetRef = useRef();

  const [lightC, setLightC] = useState("#00FFFF");
  const [actLight, setActLight] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  var video = lightC == "#00FFFF" ? 0 : 1;

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;

      lightRef.current.target.updateMatrixWorld();
    }
  }, []);

  const [activeGradient, setActiveGradient] = useState<"blue" | "red">("blue");
  const handleBlueClick = () => {
    setActiveGradient("blue");
    console.log("Blue gradient activated");
    setLightC("#00FFFF");
  };

  const handleRedClick = () => {
    setActiveGradient("red");
    console.log("Red gradient activated");
    const lights = document.querySelectorAll("pointLight");
    setLightC("#FF0000");
  };

  const handleAudioToggle = () => {
    setIsAudioOn(!isAudioOn);
  };

  const handleLightsToggle = () => {
    setActLight(!actLight);
  };

  const [camPos, setCamPos] = useState([0, 12, 30]);

  const handleCloseToggle = () => {
    setCamPos([10, 5, 10]);
  };

  const handleCenterToggle = () => {
    setCamPos([0, 12, 30]);
  };

  const handleFarToggle = () => {
    setCamPos([-30, 12, 40]);
  };

  console.log(videos[video]);

  return (
    <div>
      <div className="fixed top-20 w-full z-50 gap-2 flex justify-between p-4 ">
        <button
          onClick={handleAudioToggle}
          className={`px-2 py-2 rounded-sm font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 lg:text-2xl lg:px-5
          ${
            isAudioOn
              ? "bg-gradient-to-r from-pink-300 to-pink-200 text-white"
              : "backdrop-blur-sm bg-transparent text-gray-100 border border-gray-100"
          }`}
        >
          🎵
        </button>
        <button
          onClick={handleCloseToggle}
          className={`px-2 grow py-2 lg:hidden rounded-sm font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 
          ${
            camPos[0] === 10 && camPos[1] === 5 && camPos[2] === 10
              ? "bg-gradient-to-r from-emerald-900 to-emerald-500 text-white"
              : "bg-transparent backdrop-blur-sm text-gray-100 border border-gray-100"
          }`}
        >
          Close
        </button>
        <button
          onClick={handleCenterToggle}
          className={`px-2 py-2 grow lg:hidden rounded-sm font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 
          ${
            camPos[0] === 0 && camPos[1] === 12 && camPos[2] === 30
              ? "bg-gradient-to-r from-emerald-900 to-emerald-500 text-white"
              : "bg-transparent backdrop-blur-sm text-gray-100 border border-gray-100"
          }`}
        >
          Center
        </button>
        <button
          onClick={handleFarToggle}
          className={`px-2 py-2 grow lg:hidden rounded-sm font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 
          ${
            camPos[0] === -30 && camPos[1] === 12 && camPos[2] === 40
              ? "bg-gradient-to-r from-emerald-900 to-emerald-500 text-white"
              : "bg-transparent backdrop-blur-sm text-gray-100 border border-gray-100"
          }`}
        >
          Far
        </button>

        <button
          onClick={handleLightsToggle}
          className={`px-2 py-2 rounded-sm font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 lg:text-2xl lg:px-5
          ${
            actLight
              ? "bg-gradient-to-r from-yellow-400 to-yellow-100 text-white"
              : "bg-transparent backdrop-blur-sm text-gray-100 border border-gray-100"
          }`}
        >
          💡
        </button>
      </div>
      <div className="fixed items-centerflex-col z-50 bottom-0 w-full p-4 lg:hidden">
        <div className="flex justify-end gap-2 items-end">
          <div
            onClick={handleBlueClick}
            className={`items-start bg-gradient-to-t from-cyan-400 from-0% via-teal-500/40 via-30% to-transparent to-80% h-full rounded-md cursor-pointer transition-all duration-300 ${
              activeGradient === "blue" ? "w-[75%] pr-32" : "w-[25%] pr-4"
            }`}
          >
            <Image
              width={400}
              height={100}
              src="/2025/Pronites/shaan.webp"
              alt="Description"
            />
          </div>
          <div
            onClick={handleRedClick}
            className={` bg-gradient-to-t  from-red-600 from-0% via-orange-700/40 via-30% to-transparent to-80% h-full rounded-md cursor-pointer transition-all duration-300 ${
              activeGradient === "red" ? "w-[75%] pl-20" : "w-[25%] pl-0"
            }`}
          >
            <Image
              width={400}
              height={100}
              src="/2025/Pronites/masalacoffee.webp"
              alt="Description"
            />
          </div>
        </div>
      </div>
      <div
        className={`fixed pointer-events-none bottom-4 bg-black/50 backdrop-blur-sm rounded-r-lg rounded-b-none py-1 pr-3 z-50 flex pl-7 text-white font-bold transition-all duration-300 lg:hidden ${activeGradient === "blue" ? "text-xl" : "text-lg opacity-0"}`}
      >
        SINGER SHAAN
      </div>
      <div
        className={`fixed pointer-events-none bottom-4 bg-black/50 backdrop-blur-sm rounded-l-lg rounded-b-none py-1 pr-7 pl-3 z-50 flex justify-end text-white font-bold transition-all duration-300 lg:hidden ${
          activeGradient === "red" ? "text-xl" : "text-lg opacity-0"
        }`}
        style={{ right: "0px" }}
      >
        MASALA COFFEE
      </div>
      <div className="h-screen w-screen z-0 bg-gradient-to-t from-black to-[#080820]">
        <Canvas
          gl={{
            antialias: false,
            stencil: false,
            pixelRatio: 1,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true,
          }}
          camera={{ position: [0, 10, 15], near: 5, far: 150 }}
          style={{ background: "transparent" }}
        >
          <Stage />
          <ambientLight intensity={1} />
          <Rig _camPosisiton={camPos} />

          {actLight ? <SpotLights lightC={lightC} /> : null}

          <pointLight position={[0, 5, -5]} intensity={500} color={lightC} />

          <pointLight
            position={[40, 20, 20]}
            intensity={3000}
            color={lightC.replace("F", "1").replace("0", "F")}
          />
          <pointLight
            position={[-40, 20, 20]}
            intensity={3000}
            color={"#00FF00"}
          />
          {/* <pointLight position={[2, 5, 10]} intensity={500} color={"#FF0000"} />
        <pointLight position={[-2, 5, 10]} intensity={500} color={"#00FFFF"} /> */}
          <pointLight
            position={[0, 20, 10]}
            intensity={600}
            color={"#FFFFFF"}
          />
          <pointLight
            position={[0, 30, 20]}
            intensity={2000}
            color={"#0000FF"}
          />
          <object3D ref={targetRef} position={[0, 5, 0]} />
          <DancingPersonModel position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]} />
          <mesh position={[0, 0, 100]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[500, 240]} />

            <MeshReflectorMaterial
              blur={[1000, 1000]}
              resolution={720}
              mixBlur={1}
              mixStrength={70}
              roughness={0.8}
              depthScale={1}
              minDepthThreshold={0.4}
              maxDepthThreshold={10}
              color="#050505"
              metalness={1}
            />
          </mesh>
          <ImagePlane />
          <mesh
            position={[-33.9, 8.9, -14.8]}
            rotation={[0, Math.PI + Math.PI / 12, 0]}
          >
            <planeGeometry args={[13.7, 5]} />

            <Screen src={videos[video]} />
          </mesh>
          <mesh
            position={[32.8, 8.9, -14.8]}
            rotation={[0, Math.PI - Math.PI / 12, 0]}
          >
            <planeGeometry args={[13.7, 5]} />

            <Screen src={videos[video]} />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
}

function ImagePlane() {
  const texture = useTexture("/2025/Pronites/screentop.jpg"); // Add your image path here

  return (
    <mesh position={[-0.7, 23.8, -2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[44, 3]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Rig({ _camPosisiton }: { _camPosisiton: number[] }) {
  const { camera, mouse, size, clock } = useThree();
  const vec = new THREE.Vector3();
  const mobileThreshold = 1024;
  const isMobile = size.width < mobileThreshold;
  const look = new THREE.Vector3(0, 8, 0);

  // Define keyframes for the cinematic sequence on mobile.
  // A keyframe with duration === 0 and a "cut" flag will cause an instant change.
  const keyframes = [
    {
      pos: new THREE.Vector3(0, 5, -10),
      lookAt: look,
      duration: 0,
    },
    {
      pos: new THREE.Vector3(25, 7, 12),
      lookAt: look,
      duration: 2,
    },

    {
      pos: new THREE.Vector3(-30, 5, 10),
      lookAt: look,
      duration: 0,
    },
    {
      pos: new THREE.Vector3(-10, 2, 10),
      lookAt: look,
      duration: 2,
    },
    // Final keyframe: go to the resting position.
    {
      pos: new THREE.Vector3(0, 3, 10),
      lookAt: look,
      duration: 0,
    },
    {
      pos: new THREE.Vector3(0, 10, 30),
      lookAt: look,
      duration: 4,
    },
  ];

  // Animation state for the cinematic sequence.
  const animationState = useRef({
    running: false,
    currentKey: 0,
    elapsed: 0,
    startPos: new THREE.Vector3(),
  });

  // Start the cinematic sequence on mobile.
  useEffect(() => {
    if (isMobile && !animationState.current.running) {
      animationState.current.running = true;
      animationState.current.currentKey = 0;
      animationState.current.elapsed = 0;
      animationState.current.startPos = camera.position.clone();
    }
  }, [isMobile, camera.position]);

  useFrame((state, delta) => {
    if (isMobile) {
      // If the cinematic sequence is still running, process the keyframes.
      if (animationState.current.running) {
        const { currentKey, elapsed, startPos } = animationState.current;
        const keyframe = keyframes[currentKey];

        // If this keyframe is a "cut", immediately set the camera's position and lookAt.
        if (keyframe.cut) {
          camera.position.set(keyframe.pos.x, keyframe.pos.y, keyframe.pos.z);
          camera.lookAt(keyframe.lookAt);
          // Advance immediately to the next keyframe.
          animationState.current.currentKey++;
          animationState.current.elapsed = 0;
          animationState.current.startPos = camera.position.clone();
          return;
        }

        // Increase elapsed time and compute progress (t) from 0 to 1.
        animationState.current.elapsed += delta;
        const t = Math.min(
          animationState.current.elapsed / keyframe.duration,
          1
        );
        camera.position.lerpVectors(startPos, keyframe.pos, t);
        camera.lookAt(keyframe.lookAt);

        // If the transition is complete, advance to the next keyframe.
        if (t >= 1) {
          animationState.current.currentKey++;
          if (animationState.current.currentKey < keyframes.length) {
            animationState.current.elapsed = 0;
            animationState.current.startPos = camera.position.clone();
          } else {
            // End of cinematic sequence.
            animationState.current.running = false;
          }
        }
      } else {
        const idleSpeed = 0.4; // Speed of the bobbing
        const idleAmplitude = 1; // Amplitude of the bobbing effect
        // Compute a small offset based on sine/cosine of the elapsed clock time.
        const offsetX = Math.sin(clock.elapsedTime * idleSpeed) * idleAmplitude;
        const offsetY =
          -Math.cos(clock.elapsedTime * idleSpeed) * idleAmplitude;
        const targetPos = new THREE.Vector3(
          _camPosisiton[0] + offsetX,
          _camPosisiton[1] + offsetY,
          _camPosisiton[2]
        );
        camera.position.lerp(targetPos, 0.05);
        camera.lookAt(look);
      }
    } else {
      // For non-mobile devices, apply the default behavior (smooth mouse-based rotation).
      camera.position.lerp(vec.set(0, 12, 25), 0.005);
      const factor = 60 / Math.min(size.width, size.height);
      camera.rotation.set(
        -(mouse.y * factor) - Math.PI / 32,
        -(mouse.x * factor),
        0
      );
    }
  });

  return null;
}

function SpotLights({ lightC }: { lightC: string }) {
  let positions = [-13.5, -8.7, -4.3, 0.1, 4.5, 9, 13.5];
  return (
    <group>
      {positions.map((pos) => (
        <pointLight
          position={[pos * 1.05, 21, -15]}
          intensity={100}
          color={lightC}
        />
      ))}
    </group>
  );
}

function Stage(
  props: React.JSX.IntrinsicAttributes &
    Omit<
      ExtendedColors<
        Overwrite<
          Partial<THREE.Group<THREE.Object3DEventMap>>,
          NodeProps<THREE.Group<THREE.Object3DEventMap>, typeof THREE.Group>
        >
      >,
      NonFunctionKeys<{
        position?: Vector3;
        up?: Vector3;
        scale?: Vector3;
        rotation?: Euler;
        matrix?: Matrix4;
        quaternion?: Quaternion;
        layers?: Layers;
        dispose?: (() => void) | null;
      }>
    > & {
      position?: Vector3;
      up?: Vector3;
      scale?: Vector3;
      rotation?: Euler;
      matrix?: Matrix4;
      quaternion?: Quaternion;
      layers?: Layers;
      dispose?: (() => void) | null;
    } & EventHandlers
) {
  const { nodes, materials } = useGLTF("/2025/Pronites/Stage.glb");

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc001.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc003.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc004.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc005.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc006.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc007.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc008.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc009.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc010.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc011.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc012.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc013.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc014.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc022.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc023.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc024.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc025.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc026.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc027.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc028.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc029.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc052.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc053.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc054.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc055.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc056.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc057.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc058.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc059.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc060.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc061.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc062.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc063.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc064.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc065.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc066.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc067.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc068.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc069.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc070.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc071.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc072.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder409.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder410.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder411.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder412.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder413.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder414.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder422.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder423.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder424.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder425.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder426.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder427.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder428.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh002.geometry}
        position={[-0.571, 21.12, -25.823]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        scale={0.113}
      >
        <Screen src={videos[1]} />
      </mesh>
      <Box
        scale={[80, 40, 1]}
        material={materials.wire_177088027}
        position={[0, 0, -23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rectanwgle027.geometry}
        material={materials.wire_177088027}
        position={[-0.571, -5.12, -50.703]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.233, 0.403, 0.167]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Shape021.geometry}
        material={materials.wire_135110008}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Shape022.geometry}
        material={materials.wire_135110008}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.truss01.geometry}
        material={materials.Metal_Chrome}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube144.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube145.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube146.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube147.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube148.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube149.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube157.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube158.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube159.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube160.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube161.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube162.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube163.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube006_Cube017.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube018.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008_Cube019.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009_Cube020.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube050.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube051.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube052.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube053.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube054.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube055.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder014_Cylinder005.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015_Cylinder023.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder036.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Cylinder038 as THREE.Mesh).geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube001.geometry}
        material={materials["Material.001"]}
        position={[-22.149, -5.752, -15.039]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube002.geometry}
        material={materials["Material.001"]}
        position={[18.688, -5.752, -15.039]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube003.geometry}
        material={materials["Material.001"]}
        position={[-35.54, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube004.geometry}
        material={materials["Material.001"]}
        position={[39.871, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube005.geometry}
        material={materials["Material.001"]}
        position={[-23.347, 9.168, -2.65]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube006.geometry}
        material={materials["Material.001"]}
        position={[80.856, 9.168, -2.65]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={2.423}
      />
    </group>
  );
}

useGLTF.preload("/2025/Pronites/Stage.glb");
useGLTF.preload("/2025/Pronites/shaan.glb");

function DancingPersonModel(
  props: React.JSX.IntrinsicAttributes &
    Omit<
      ExtendedColors<
        Overwrite<
          Partial<THREE.Group<THREE.Object3DEventMap>>,
          NodeProps<THREE.Group<THREE.Object3DEventMap>, typeof THREE.Group>
        >
      >,
      NonFunctionKeys<{
        position?: Vector3;
        up?: Vector3;
        scale?: Vector3;
        rotation?: Euler;
        matrix?: Matrix4;
        quaternion?: Quaternion;
        layers?: Layers;
        dispose?: (() => void) | null;
      }>
    > & {
      position?: Vector3;
      up?: Vector3;
      scale?: Vector3;
      rotation?: Euler;
      matrix?: Matrix4;
      quaternion?: Quaternion;
      layers?: Layers;
      dispose?: (() => void) | null;
    } & EventHandlers
) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/2025/Pronites/shaan.glb");
  const { actions } = useAnimations(animations, group);

  // Start the first animation once the component mounts.
  useEffect(() => {
    if (animations.length && actions) {
      // Replace "AnimationName" with the name of the animation you want to play,
      // or use animations[0].name if you want the first animation.
      const animName = animations[1].name;
      actions[animName]?.play();
    }
  }, [animations, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={2.604}>
          <skinnedMesh
            name="avaturn_body001"
            geometry={nodes.avaturn_body001.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0001"
            geometry={nodes.avaturn_hair_0001.geometry}
            material={nodes.avaturn_hair_0001.material}
            skeleton={nodes.avaturn_hair_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1001"
            geometry={nodes.avaturn_hair_1001.geometry}
            material={materials["Material.001"]}
            skeleton={nodes.avaturn_hair_1001.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0001"
            geometry={nodes.avaturn_look_0001.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0001"
            geometry={nodes.avaturn_shoes_0001.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0001.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
        <group
          name="Object_3_124"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_126">
            <group name="_125">
              <mesh
                name="Object_49"
                castShadow
                receiveShadow
                geometry={nodes.Object_49.geometry}
                material={materials["BodyMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_9_142"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_144">
            <group name="_143">
              <mesh
                name="Object_73"
                castShadow
                receiveShadow
                geometry={nodes.Object_73.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_14_157"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_159">
            <group name="_158">
              <mesh
                name="Object_93"
                castShadow
                receiveShadow
                geometry={nodes.Object_93.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_19_172"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_174">
            <group name="_173">
              <mesh
                name="Object_113"
                castShadow
                receiveShadow
                geometry={nodes.Object_113.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_20_175"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_177">
            <group name="_176">
              <mesh
                name="Object_117"
                castShadow
                receiveShadow
                geometry={nodes.Object_117.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_21_178"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_180">
            <group name="_179">
              <mesh
                name="Object_121"
                castShadow
                receiveShadow
                geometry={nodes.Object_121.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_22_181"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_183">
            <group name="_182">
              <mesh
                name="Object_125"
                castShadow
                receiveShadow
                geometry={nodes.Object_125.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_23_184"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_186">
            <group name="_185">
              <mesh
                name="Object_129"
                castShadow
                receiveShadow
                geometry={nodes.Object_129.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_26_193"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_195">
            <group name="_194">
              <mesh
                name="Object_141"
                castShadow
                receiveShadow
                geometry={nodes.Object_141.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_27_196"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_198">
            <group name="_197">
              <mesh
                name="Object_145"
                castShadow
                receiveShadow
                geometry={nodes.Object_145.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_28_199"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_201">
            <group name="_200">
              <mesh
                name="Object_149"
                castShadow
                receiveShadow
                geometry={nodes.Object_149.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_29_202"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_204">
            <group name="_203">
              <mesh
                name="Object_153"
                castShadow
                receiveShadow
                geometry={nodes.Object_153.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_31_208"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_210">
            <group name="_209">
              <mesh
                name="Object_161"
                castShadow
                receiveShadow
                geometry={nodes.Object_161.geometry}
                material={materials["NeckMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_32_211"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_213">
            <group name="_212">
              <mesh
                name="Object_165"
                castShadow
                receiveShadow
                geometry={nodes.Object_165.geometry}
                material={materials["NeckMaterial.001"]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function VideoMaterial({ src, setVideo }) {
  const texture = useVideoTexture(src);

  texture.wrapS = THREE.RepeatWrapping;

  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.x = -1;

  texture.offset.x = 1;

  setVideo?.(texture.image);

  return (
    <meshStandardMaterial
      side={THREE.DoubleSide}
      map={texture}
      toneMapped={false}
      transparent
      opacity={1}
    />
  );
}

function Screen({ src }: { src: string }) {
  const [video, setVideo] = useState();

  const ratio = 16 / 9;

  const width = 5;

  const radius = 5;

  const z = 4;

  const r = useMemo(
    () => (video ? video.videoWidth / video.videoHeight : ratio),

    [video, ratio]
  );

  return <VideoMaterial src={src} setVideo={setVideo} />;
}
