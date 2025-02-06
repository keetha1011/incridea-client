import React, { Suspense, useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

gsap.registerPlugin();

function Model({
  imgArr,
  currentIndex,
  setCurrentIndex,
  timeline,
}: {
  imgArr: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  timeline: gsap.core.Timeline;
}) {
  const gltf = useLoader(GLTFLoader, "assets/3d/pendulum.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  const nodes = gltf.nodes as unknown as { [key: string]: THREE.Mesh };
  const materials: { [key: string]: THREE.Material } = gltf.materials;
  const pendulumGroupRef = useRef<THREE.Group | null>(null);
  const isDragging = useRef(false);
  const previousRotation = useRef<number>(0);
  const hasReachedRight = useRef<boolean>(false);
  const limitRight = Math.PI / 8;
  const limitLeft = -Math.PI / 8;

  useEffect(() => {
    if (!pendulumGroupRef.current) return;

    if (!isDragging.current) {
      gsap.killTweensOf(pendulumGroupRef.current.rotation);
      pendulumGroupRef.current.rotation.z = limitLeft;
      previousRotation.current = limitLeft;
      hasReachedRight.current = false;

      timeline.clear();
      timeline.to(pendulumGroupRef.current.rotation, {
        z: limitRight,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: () => {
          if (!pendulumGroupRef.current) return;
          const currentRotation = pendulumGroupRef.current.rotation.z;

          // Check if we've reached the right extreme
          if (Math.abs(currentRotation - limitRight) < 0.01) {
            hasReachedRight.current = true;
          }

          // Check if we've completed a full swing from right to left
          if (
            hasReachedRight.current &&
            Math.abs(currentRotation - limitLeft) < 0.01
          ) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length);
            hasReachedRight.current = false;
          }

          previousRotation.current = currentRotation;
        },
      });
    }
  }, [timeline, setCurrentIndex, imgArr.length, limitLeft, limitRight]);

  const bind = useDrag(({ offset: [x], last, first }) => {
    if (!pendulumGroupRef.current) return;

    if (first) {
      timeline.pause();
      gsap.killTweensOf(pendulumGroupRef.current.rotation);
    }
    isDragging.current = true;
    const newRotation = THREE.MathUtils.clamp(x * 0.002, limitLeft, limitRight);
    gsap.to(pendulumGroupRef.current.rotation, {
      z: newRotation,
      duration: 0.1,
      ease: "power2.out",
    });

    if (last) {
      isDragging.current = false;
      hasReachedRight.current = false;
      timeline.resume();
    }
  });
  const bindProps = bind() as unknown as Partial<GroupProps>;

  return (
    <group
      ref={pendulumGroupRef}
      {...bindProps}
      dispose={null}
      scale={[1, 1, 0.75]}
      position={[0, 3.8, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder?.geometry}
        material={materials["Material.002"]}
        rotation={[-Math.PI, 0, -Math.PI]}
        position={[0, -1.63, 0]}
        scale={[0.078, 3.8, 0.078]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sphere?.geometry}
          material={materials["Material.001"]}
          position={[0, -1.15, 0]}
          rotation={[-Math.PI, 0, -Math.PI]}
          scale={[8.787, 0.211, 8.787]}
        />
      </mesh>
    </group>
  );
}

// Rest of the code remains the same...

const Carousel = ({
  imgArr,
  currentIndex,
  timeline,
}: {
  imgArr: string[];
  currentIndex: number;
  timeline: gsap.core.Timeline;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || imgRefs.current.length === 0) return;

    imgRefs.current.forEach((img, index) => {
      if (!img) return;

      let xOffset = "0%";
      let scale = 1;
      let opacity = 1;
      let zIndex = 5;

      const prevIndex = (currentIndex - 1 + imgArr.length) % imgArr.length;
      const nextIndex = (currentIndex + 1) % imgArr.length;
      const firstIndex = (currentIndex - 2 + imgArr.length) % imgArr.length;
      const lastIndex = (currentIndex + 2) % imgArr.length;

      if (index === prevIndex) {
        xOffset = "110%";
        scale = isMobile ? 0.7 : 0.6;
        zIndex = 5;
      } else if (index === currentIndex) {
        xOffset = "0%";
        scale = isMobile ? 1.2 : 1;
        zIndex = 10;
      } else if (index === nextIndex) {
        xOffset = "-110%";
        scale = isMobile ? 0.7 : 0.6;
        zIndex = 5;
      } else if (index === firstIndex) {
        xOffset = "-220%";
        opacity = 0;
      } else if (index === lastIndex) {
        xOffset = "200%";
        opacity = 0;
        zIndex = -50;
      } else {
        opacity = 0;
        zIndex = 0;
      }

      //initial
      gsap.set(img, {
        x: xOffset,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
      });

      //on currentIndex changes
      gsap.to(img, {
        x: xOffset,
        scale: scale,
        opacity: opacity,
        duration: 1,
        ease: "power2.inOut",
        zIndex: zIndex,
      });
    });
  }, [currentIndex, imgArr, timeline, isMobile]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative flex w-full justify-center items-center"
      >
        {imgArr.map((img, index) => {
          if (
            ![
              (currentIndex - 1 + imgArr.length) % imgArr.length,
              currentIndex,
              (currentIndex + 1) % imgArr.length,
              (currentIndex - 2 + imgArr.length) % imgArr.length,
              (currentIndex + 2) % imgArr.length,
            ].includes(index)
          )
            return null;

          return (
            <Image
              key={index}
              ref={(el) => {
                imgRefs.current[index] = el;
              }}
              src={"/assets/jpeg/Nakash.jpeg"}
              alt="Slide"
              width={48}
              height={48}
              className="absolute rounded-lg shadow-lg w-1/3 transition-opacity duration-500"
            />
          );
        })}
      </div>
    </div>
  );
};

const Inc2023 = ({ imgArr }: { imgArr: string[] }) => {
  // const imgArr = [
  //   "/assets/galleryBg/inc22-gallerybg.jpg",
  //   "/assets/galleryBg/inc23-gallerybg.jpg",
  //   "/assets/galleryBg/inc24-gallerybg.jpg",
  //   "/assets/jpeg/DhvaniBhanushali.jpeg",
  //   "/assets/jpeg/download.jpeg",
  //   "/assets/jpeg/Nakash.jpeg",
  // ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeline = useRef(gsap.timeline({ repeat: -1, yoyo: true })).current;

  return (
    <div className="h-screen w-full bg-[url('/assets/galleryBg/inc23-gallerybg.jpg')] bg-cover bg-center flex flex-col items-center justify-center">
      <div className="relative w-full top-[43%] h-80 flex items-center justify-center overflow-hidden">
        <Carousel
          imgArr={imgArr}
          currentIndex={currentIndex}
          timeline={timeline}
        />
      </div>
      <div className="flex h-screen w-full items-center justify-center">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 35 }}
          style={{ width: "100%", height: "100%" }}
        >
          <directionalLight position={[0, 0, 5]} intensity={10} />
          <Suspense fallback={null}>
            <Model
              imgArr={imgArr}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              timeline={timeline}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Inc2023;
