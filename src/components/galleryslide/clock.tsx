import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";

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

  return (
    <group dispose={null} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
      <mesh
        name="clock_face"
        castShadow
        receiveShadow
        geometry={nodes.clock_face.geometry}
        material={materials["Material.005"]}
        scale={[2.2, 0.11, 2.2]}
      />
      <group position={[0, 0.5, 0]} ref={handRef} rotation={[Math.PI, 0, 0]}>
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
};

const Clock = ({ onClockClick }: ClockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<THREE.Group>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);

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

      if (active) {
        // During drag, update rotation immediately
        gsap.to(handRef.current.rotation, {
          y: currentAngle - Math.PI / 2,
          duration: 0,
          overwrite: true,
        });
      }

      if (last) {
        // On release, snap to nearest quarter position with animation
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
      className="absolute top-[10%] left-[50%] -translate-x-1/2 cursor-pointer z-10 aspect-square md:w-[280px] w-[250px] touch-none"
      {...bind()}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={5} />
        <directionalLight position={[0, 0, 3]} intensity={10} />
        <Model handRef={handRef} />
      </Canvas>
    </div>
  );
};

export default Clock;
