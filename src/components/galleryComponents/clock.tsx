import { useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import type * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import { DRACOLoader, GLTFLoader, type GLTF } from "three-stdlib";
import { angleToScenes } from "~/pages/gallery";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
} from "@react-three/postprocessing";

type GLTFResult = GLTF & {
  nodes: {
    clock_face: THREE.Mesh;
    clock_hand: THREE.Mesh;
  };
  materials: {
    ["Material"]: THREE.MeshStandardMaterial;
    ["pointer_Mat.001"]: THREE.MeshStandardMaterial;
  };
};

const getSnapAngle = (angle: number): number => {
  const snapAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
  const threshold = Math.PI / 4;

  let closestAngle = snapAngles[0];
  let minDiff = Math.abs(angle - (snapAngles[0] ?? 0));

  for (const snapAngle of snapAngles) {
    const diff = Math.abs(angle - snapAngle);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = snapAngle;
    }
  }

  return minDiff <= threshold ? (closestAngle ?? angle) : angle;
};

const Model = ({ handRef }: { handRef: React.RefObject<THREE.Group> }) => {
  const gltf = useLoader(GLTFLoader, "/2025/gallery/3d/clock.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
  }) as GLTFResult;

  const { nodes, materials } = gltf;

  return (
    <group
      dispose={null}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1.9, 1.9, 1.9]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clock_face.geometry}
        material={materials.Material}
        scale={[1.25, 0.067, 1.25]}
      >
        <group
          position={[0, 0.5, 0]}
          ref={handRef}
          rotation={[Math.PI, Math.PI, Math.PI]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.clock_hand.geometry}
            material={materials["pointer_Mat.001"]}
            position={[0.005, 1.179, -0.14]}
            rotation={[Math.PI / 2, 0, 2.193]}
            scale={[0.013, 0.013, 0.2]}
          />
        </group>
      </mesh>
    </group>
  );
};

type ClockProps = {
  onClockClick?: (angle: number) => void;
  year: number;
};

const Clock = ({ onClockClick, year }: ClockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<THREE.Group>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const previousAngleRef = useRef<number | null>(null); // Tracks the last angle during drag

  useEffect(() => {
    // Create GSAP context
    gsapContextRef.current = gsap.context(() => {
      console.log("Clock GSAP context created");
    }, containerRef);

    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }
    };
  }, []);

  const normalizeAngle = (angle: number) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  };

  const calculateShortestPath = useMemo(
    () => (current: number, target: number) => {
      const normalizedCurrent = normalizeAngle(current);
      const delta = normalizeAngle(target - normalizedCurrent);
      return normalizedCurrent + delta;
    },
    [],
  );

  useEffect(() => {
    if (!handRef.current) return;

    const scene = Object.entries(angleToScenes).find(
      ([key]) => Number(key) === year,
    );

    const targetAngle = scene?.[1][0] ?? 0;

    const currentAngle = normalizeAngle(handRef.current.rotation.y);
    const shortestPathAngle = calculateShortestPath(currentAngle, targetAngle);

    gsap.fromTo(
      handRef.current.rotation,
      { y: currentAngle },
      {
        y: shortestPathAngle,
        duration: 1,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [year, calculateShortestPath]);

  const getAngleFromCenter = (x: number, y: number) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from center
    let angle = Math.atan2(y - centerY, x - centerX);

    // Normalize angle to [0, 2π]
    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  };

  const bind = useDrag(
    ({ active, xy: [x, y], first, last }) => {
      if (!handRef.current) return;

      const currentAngle = getAngleFromCenter(x, y);
      if (first) {
        previousAngleRef.current = currentAngle;
        return;
      }

      previousAngleRef.current = currentAngle;

      // Direct rotation application
      if (handRef.current) {
        handRef.current.rotation.y = currentAngle - Math.PI / 2;
      }

      // if (active) {
      //   gsap.to(handRef.current.rotation, {
      //     y: currentAngle - Math.PI / 2,
      //     duration: 0,
      //     overwrite: true,
      //   });
      // }

      if (last) {
        const snappedAngle = getSnapAngle(currentAngle);
        gsap.to(handRef.current.rotation, {
          y: snappedAngle - Math.PI / 2,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            if (onClockClick) {
              onClockClick(snappedAngle - Math.PI / 2);
            }
          },
        });
      }
    },
    {
      pointer: { touch: true },
      preventDefault: true,
    },
  );

  return (
    <div
      ref={containerRef}
      className="cursor-pointer z-10 aspect-square sm:w-[230px] w-[200px] touch-none rounded-full overflow-hidden"
      {...bind()}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* <ambientLight intensity={3} /> */}
        <directionalLight position={[0, 0, 1]} intensity={2.2} />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
            height={500}
          />
          <BrightnessContrast contrast={0.5}></BrightnessContrast>
        </EffectComposer>
        <Model handRef={handRef} />
      </Canvas>
    </div>
  );
};

export default Clock;
