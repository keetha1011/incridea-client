import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

const Inc23 = ({ imgArr }: { imgArr: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Canvas>
        <ambientLight intensity={5} />
        <Suspense fallback={null}>
          <Model
            imgArr={imgArr}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setPrevIndex={setPrevIndex}
          />
        </Suspense>
      </Canvas>
      {/* Image Carousel Overlay */}
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-40">
        {imgArr.length > 0 &&
          (window.innerWidth < 768 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]).map(
            (offset) => {
              const index =
                (currentIndex + offset + imgArr.length) % imgArr.length;
              const isCenter = offset === 0;

              // Calculate xPos based on offset
              const xPos =
                offset === -2
                  ? -1000
                  : offset === -1
                    ? -500
                    : offset === 1
                      ? 500
                      : offset === 2
                        ? 1000
                        : 0;

              // Adjust opacity for left and right images
              const opacity = isCenter ? 1 : 0.6;

              return (
                <div
                  key={index}
                  className={`absolute md:w-80 w-64 md:h-52 h-40 transition-all duration-700 ease-in-out]
                }`}
                  style={{
                    transform: `translateX(${xPos}px) scale(${isCenter ? 1.3 : 1})`,
                    opacity: opacity,
                    transition:
                      "transform 1s ease-in-out, opacity 1s ease-in-out",
                  }}
                >
                  <img
                    src={imgArr[index]}
                    className="object-cover w-full h-full rounded-lg shadow-lg transition-transform duration-700 ease-in-out"
                    alt={`Carousel image ${index}`}
                  />
                </div>
              );
            },
          )}
      </div>
    </div>
  );
};

const Model = ({
  imgArr,
  currentIndex,
  setCurrentIndex,
  setPrevIndex,
}: {
  imgArr: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setPrevIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const pendulumRef = useRef<THREE.Object3D | null>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const gltf = useLoader(GLTFLoader, "assets/3d/pendulum.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    loader.setDRACOLoader(dracoLoader);
  });

  useEffect(() => {
    if (pendulumRef.current && pivotRef.current) {
      if (animationRef.current) animationRef.current.kill();

      pivotRef.current.rotation.z = -Math.PI / 12;

      animationRef.current = gsap.to(pivotRef.current.rotation, {
        z: Math.PI / 12,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onRepeat: () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length);
          setPrevIndex((prevIndex) => (prevIndex - 1) % imgArr.length);
        },
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, [imgArr.length, setCurrentIndex]);

  return (
    <group ref={pivotRef} position={[0, 1.5, 0]}>
      <primitive
        ref={pendulumRef}
        object={gltf.scene}
        scale={[0.7, 0.6, 0.7]}
        position={[0, -1.5, 0]}
      />
    </group>
  );
};

export default Inc23;
