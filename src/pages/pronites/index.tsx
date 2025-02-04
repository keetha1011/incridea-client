import { useGSAP } from "@gsap/react";
import {
  Text,
  useTexture,
  MeshReflectorMaterial,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { SlVolume2, SlVolumeOff } from "react-icons/sl";
import * as THREE from "three";

import Loader from "~/components/pronite/loader";
import ProniteCard from "~/components/pronites/card";
import Info from "~/components/pronites/info";
import { env } from "~/env";

const Dhvani = dynamic(() => import("~/components/pronites/dhvani"), {
  ssr: false,
});

const Nakash = dynamic(() => import("~/components/pronites/nakash"), {
  ssr: false,
});

const artists = [
  {
    name: "Dhvani Bhanushali",
    time: "23rd Feb @ 7PM",
    imageSrc: `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/jpeg/DhvaniBhanushali.jpeg`,
    audioSrc: `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/assets/mp3/DhvaniBhanushali.mp3`,
  },
  {
    name: "Nakash Aziz",
    time: "24th Feb @ 7PM",
    imageSrc: `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/jpeg/Nakash.jpeg`,
    audioSrc: `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/assets/mp3/NakashAziz.mp3`,
  },
];

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isArtist1, setIsArtist1] = useState(true);
  const angle = useRef<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [instruction, setInstruction] = useState<boolean>(true);

  const { progress, total, loaded } = useProgress();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (progress === 100 && loaded === total) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [progress, loaded, total]);

  useEffect(() => {
    if (!loading) {
      if (audioRef.current)
        audioRef.current.src = artists[isArtist1 ? 0 : 1]!.audioSrc;
      if (audioRef.current) audioRef.current.currentTime = 0;
      void audioRef.current?.play();

      if (timeRef.current) {
        clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => {
          setIsArtist1(!isArtist1);
          angle.current = angle.current + Math.PI;
        }, 15000);
      } else {
        timeRef.current = setTimeout(() => {
          setIsArtist1(!isArtist1);
          angle.current = angle.current + Math.PI;
        }, 15000);
      }
    }
  }, [isArtist1, loading]);

  const artistGroup = useRef<THREE.Group | null>(null);
  const nameGroup = useRef<THREE.Group | null>(null);

  useGSAP(() => {
    if (artistGroup.current && nameGroup.current) {
      gsap.to(artistGroup.current.rotation, {
        y: -angle.current,
        duration: 1,
      });
      gsap.to(nameGroup.current.rotation, {
        y: angle.current,
        duration: 1,
      });
    }
  }, [isArtist1]);

  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ProniteCard
        artist={{ ...artists[0]! }}
        isArtist={isArtist1}
        gradient="pink"
      />
      <ProniteCard
        artist={{ ...artists[1]! }}
        isArtist={!isArtist1}
        gradient="blue"
      />
      <Info />
      <button
        onClick={() => {
          if (audioRef.current) audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
        }}
        className="absolute right-3 top-[95px] z-50 cursor-pointer text-white"
      >
        {isMuted ? (
          <SlVolumeOff className="h-8 w-8 transition-colors duration-150" />
        ) : (
          <SlVolume2 className="h-8 w-8 transition-colors duration-150" />
        )}
      </button>
      <audio ref={audioRef} loop={true} muted={isMuted}></audio>
      {instruction && !loading && (
        <div className="absolute bottom-48 left-1/2 z-50 -translate-x-1/2 animate-pulse text-base text-gray-400 opacity-65 md:bottom-56 md:text-lg lg:bottom-10 xl:text-xl">
          Click to see next artist
        </div>
      )}
      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        gl={{ alpha: false }}
        camera={{ position: [0, 3, 100], fov: 15 }}
        onClick={() => {
          angle.current = angle.current + Math.PI;
          setIsArtist1(!isArtist1);
          setInstruction(false);
        }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 15, 20]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <group ref={artistGroup}>
              <Dhvani position={[0, 0, 1]} scale={0.9} rotation={[0, 0, 0]} />
              <Nakash
                position={[0, 0, 0]}
                scale={1}
                rotation={[0, Math.PI, 0]}
              />
            </group>
            <group ref={nameGroup} position={[0, 0, 6]}>
              <DhvaniText position={[0, 1, -8]} />
              <NakashText position={[0, 1, 8]} />
            </group>
            <Ground />
          </group>
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={1} />
          <directionalLight position={[-50, 0, -40]} intensity={5} />
          <Intro />
        </Suspense>
      </Canvas>
      <Loader loading={loading} />
    </>
  );
}

function DhvaniText(props: { position: [x: number, y: number, z: number] }) {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/assets/mp4/dhvani.mp4`,
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    }),
  );
  useEffect(() => void video.play(), [video]);

  const [size, setSize] = useState<{ height: number; width: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setSize({ height: window.innerHeight, width: window.innerWidth });
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        setSize({ height: window.innerHeight, width: window.innerWidth });
      });
    }
  }, []);

  return (
    <Text
      font="/font/Inter-Bold.woff"
      fontSize={Math.min((size.width * (2 - 0.1)) / (1920 - 720), 2)}
      letterSpacing={-0.06}
      {...props}
    >
      Dhvani
      <meshBasicMaterial toneMapped={false}>
        <videoTexture
          attach="map"
          args={[video]}
          colorSpace={THREE.SRGBColorSpace}
        />
      </meshBasicMaterial>
    </Text>
  );
}

function NakashText(props: { position: [x: number, y: number, z: number] }) {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/assets/mp4/nakash.mp4`,
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    }),
  );
  useEffect(() => void video.play(), [video]);

  const [size, setSize] = useState<{ height: number; width: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setSize({ height: window.innerHeight, width: window.innerWidth });
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        setSize({ height: window.innerHeight, width: window.innerWidth });
      });
    }
  }, []);

  return (
    <Text
      font="/font/Inter-Bold.woff"
      fontSize={Math.min((size.width * (2 - 0.1)) / (1920 - 720), 2)}
      letterSpacing={-0.06}
      {...props}
      rotation={[0, Math.PI, 0]}
    >
      Nakash
      <meshBasicMaterial toneMapped={false}>
        <videoTexture
          attach="map"
          args={[video]}
          colorSpace={THREE.SRGBColorSpace}
        />
      </meshBasicMaterial>
    </Text>
  );
}

function Ground() {
  const [floor, normal] = useTexture([
    `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/pronite/SurfaceImperfections003_1K_var1.jpg`,
    `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/pronite/SurfaceImperfections003_1K_Normal.jpg`,
  ]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mirror={0.5}
        mixBlur={6}
        mixStrength={1.5}
        color="#a0a0a0"
        metalness={0.4}
        roughnessMap={floor}
        normalMap={normal}
        normalScale={new THREE.Vector2(2, 2)}
      />
    </mesh>
  );
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(
      vec.set(state.pointer.x * 5, 3 + state.pointer.y * 2, 14),
      0.05,
    );
    state.camera.lookAt(0, 0, 0);
  });
}
