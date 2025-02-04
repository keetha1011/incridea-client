import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import type { GLTF } from "three-stdlib";
import { angleToScenes } from "~/pages/gallery";
type GLTFResult = GLTF & {
  nodes: {
    clock_face: THREE.Mesh;
    clock_hand: THREE.Mesh;
  };
  materials: {
    ["Material.005"]: THREE.MeshStandardMaterial;
    ["Material.008"]: THREE.MeshStandardMaterial;
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
  const { nodes, materials } = useGLTF("/assets/3d/clock.glb") as GLTFResult;
  // const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));

  // useEffect(() => {
  //   if (window.innerWidth < 768) {
  //     setScale(new THREE.Vector3(0.9, 0.9, 0.9));
  //   } else {
  //     setScale(new THREE.Vector3(0.8, 0.8, 0.8));
  //   }

  //   const resize = () => {
  //     if (window.innerWidth < 768) {
  //       setScale(new THREE.Vector3(0.9, 0.9, 0.9));
  //     } else {
  //       setScale(new THREE.Vector3(0.8, 0.8, 0.8));
  //     }
  //   };

  //   window.addEventListener("resize", resize);

  //   return () => window.removeEventListener("resize", resize);
  // }, []);

  return (
    <group dispose={null} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
      <mesh
        name="clock_face"
        castShadow
        receiveShadow
        geometry={nodes.clock_face.geometry}
        material={materials["Material.005"]}
        scale={[2, 0.1, 2]}
      />
      <group
        position={[0, 0.5, 0]}
        ref={handRef}
        rotation={[Math.PI, Math.PI, 0]}
      >
        <mesh
          name="clock_hand"
          castShadow
          receiveShadow
          geometry={nodes.clock_hand.geometry}
          material={materials["Material.008"]}
          scale={[0.015, 0.015, 0.015]}
        />
      </group>
    </group>
  );
};

useGLTF.preload("/assets/3d/clock.glb");

type ClockProps = {
  onClockClick?: (angle: number) => void;
  year: number;
};

const Clock = ({ onClockClick, year }: ClockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<THREE.Group>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const [totalRotation, setTotalRotation] = useState(0); // Total accumulated rotation in radians
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

  const calculateShortestPath = (current: number, target: number) => {
    const normalizedCurrent = normalizeAngle(current);
    const delta = normalizeAngle(target - normalizedCurrent);
    return normalizedCurrent + delta;
  };

  useEffect(() => {
    console.log("Year changed to", year);
    if (!handRef.current) return;

    const scene = Object.entries(angleToScenes).find(
      ([key]) => Number(key) === year,
    );
    console.log("Scene", scene);
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
  }, [year]);

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
  useEffect(() => {
    console.log("Rotation changed to", totalRotation);
  }, [totalRotation]);

  const bind = useDrag(
    ({ active, xy: [x, y], first, last }) => {
      if (!handRef.current) return;

      const currentAngle = getAngleFromCenter(x, y);
      if (first) {
        previousAngleRef.current = currentAngle;
        return;
      }

      const previousAngle = previousAngleRef.current ?? 0;
      let delta = currentAngle - previousAngle;
      delta =
        delta > Math.PI
          ? delta - 2 * Math.PI
          : delta < -Math.PI
            ? delta + 2 * Math.PI
            : delta;

      // Accumulate the total rotation
      const newTotalRotation = totalRotation + delta;
      setTotalRotation(newTotalRotation);

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
        setTotalRotation(0);
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
        <ambientLight intensity={2} />
        <directionalLight position={[0, 0, 3]} intensity={4} />
        <Model handRef={handRef} />
      </Canvas>
    </div>
  );
};

export default Clock;
