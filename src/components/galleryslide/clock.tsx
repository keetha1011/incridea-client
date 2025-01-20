import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

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

const Model = ({ handRotation }: { handRotation: number }) => {
  const { nodes, materials } = useGLTF("/assets/3d/clock.glb") as GLTFResult;

  return (
    <group dispose={null} rotation={[Math.PI / 2, 0, 0]}>
      {/* Clock Face */}
      <mesh
        name="clock_face"
        castShadow
        receiveShadow
        geometry={nodes.clock_face.geometry}
        material={materials["Material.005"]}
        scale={[2.2, 0.11, 2.2]}
      />
      {/* Clock Hand */}
      <a.group position={[0, 0.5, 0]} rotation={[0, handRotation, 0]}>
        <mesh
          name="clock_hand"
          castShadow
          receiveShadow
          geometry={nodes.clock_hand.geometry}
          material={materials["Material.008"]}
          scale={[0.015, 0.015, 0.015]}
        />
      </a.group>
    </group>
  );
};

useGLTF.preload("/assets/3d/clock.glb");

type ClockProps = {
  onClockClick: () => void;
};

const Clock = ({ onClockClick }: ClockProps) => {
  const [handRotation, setHandRotation] = useState(0); // Rotation of the hand
  const [clickCount, setClickCount] = useState(0); // Number of clicks

  const { handRotation: animatedRotation } = useSpring({
    handRotation,
    config: { tension: 180, friction: 14 },
    from: { handRotation },
  });

  const handleClockClick = useCallback(() => {
    // Rotate the hand on other clicks
    setHandRotation((prevRotation) => prevRotation - Math.PI / 2);
    onClockClick(); // Notify parent component
  }, [onClockClick]);

  return (
    <div
      style={{
        position: "absolute",
        top: "10%", // Place the clock near the top
        left: "50%",
        transform: "translate(-50%, 0)",
        cursor: "pointer",
        boxShadow: "0 0 15px 5px rgba(0, 200, 0, 0.6)", // Glow effect
        borderRadius: "50%",
        padding: "10px",
      }}
      onClick={handleClockClick}
    >
      <Canvas
        style={{ width: "200px", height: "200px" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <Model handRotation={animatedRotation.get()} />
      </Canvas>
    </div>
  );
};

export default Clock;
