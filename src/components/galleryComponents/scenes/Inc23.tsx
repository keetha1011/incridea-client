import React, { Suspense, useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { GroupProps } from "@react-three/fiber";
import gsap from "gsap";
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

  const nodes = gltf.nodes as Record<string, THREE.Mesh>;
  const materials = gltf.materials as Record<string, THREE.Material>;
  const pendulumGroupRef = useRef<THREE.Group | null>(null);
  const isDragging = useRef(false);
  const limitr = Math.PI / 6;
  const limitl = -Math.PI / 6;

  useEffect(() => {
    if (!pendulumGroupRef.current) return;

    // Start GSAP animation if not dragging
    if (!isDragging.current) {
      pendulumGroupRef.current.rotation.z = limitl;
      timeline.to(
        pendulumGroupRef.current.rotation,
        {
          z: limitr,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          onRepeat: () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length);
          },
        },
        0,
      );
    }
  }, [timeline, setCurrentIndex, imgArr.length]);

  // Handle Drag Gesture
  const bind = useDrag(({ offset: [x] }) => {
    if (!pendulumGroupRef.current) return;
    isDragging.current = true;

    const newRotation = THREE.MathUtils.clamp(x * 0.002, limitl, limitr);
    pendulumGroupRef.current.rotation.z = newRotation;

    // If dragged to the limit, switch image and restart GSAP
    if (newRotation === limitl || newRotation === limitr) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length);
      isDragging.current = false;

      // Restart GSAP animation after drag ends
      timeline.clear();
      pendulumGroupRef.current.rotation.z = limitl;
      timeline.to(pendulumGroupRef.current.rotation, {
        z: limitr,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  });

  return (
    <group
      {...(pendulumGroupRef as unknown as GroupProps)} // Fix ref type mismatch
      ref={pendulumGroupRef}
      dispose={null}
      scale={[0.75, 0.75, 0.75]}
      position={[0, 2.2, 0]}
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

      timeline.to(
        img,
        {
          x: xOffset,
          scale: scale,
          opacity: opacity,
          duration: 1,
          ease: "power2.inOut",
          zIndex: zIndex,
        },
        0,
      );
    });
  }, [currentIndex, imgArr.length, timeline]);

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
            <img
              key={index}
              ref={(el) => {
                imgRefs.current[index] = el;
              }}
              src={img}
              alt="Slide"
              className="absolute rounded-lg shadow-lg w-1/3 h-48 md:h-64 transition-opacity duration-500"
            />
          );
        })}
      </div>
    </div>
  );
};

const Inc23 = ({ imgArr }: { imgArr: string[] }) => {
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

export default Inc23;
