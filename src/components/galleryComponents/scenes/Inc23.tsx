import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

const Inc23 = ({ imgArr }: { imgArr: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Canvas>
        <ambientLight intensity={5} />
        <Suspense fallback={null}>
          <Model
            imgArr={imgArr}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </Suspense>
      </Canvas>

      {/* Image Carousel Overlay */}
      <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 flex gap-4 space-x-10">
        {imgArr.length > 0 &&
          [-1, 0, 1].map((offset) => {
            const index =
              (currentIndex + offset + imgArr.length) % imgArr.length;
            const scale = offset === 0 ? "scale-125" : "scale-100 opacity-70"; // Middle image is larger
            return (
              <div className="w-80 h-40 relative" key={index}>
                <img
                  src={imgArr[index]}
                  className={`object-fit object-center transition-all duration-500 ${scale}`}
                  alt={`Carousel image ${index}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

const Model = ({
  imgArr,
  currentIndex,
  setCurrentIndex,
}: {
  imgArr: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
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
          setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length); // Change image every oscillation
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
