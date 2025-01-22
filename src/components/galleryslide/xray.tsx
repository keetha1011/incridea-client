import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    Cylinder: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
  };
};

type XRayEnclosureProps = {
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
};

const XRayEnclosure = ({ isPaused, setIsPaused }: XRayEnclosureProps) => {
  const { nodes, materials } = useGLTF("/assets/3d/xray.glb") as GLTFResult;

  const handleButtonClick = () => {
    setIsPaused(!isPaused); // Toggle the `isPaused` state
  };

  return (
    <group dispose={null} rotation={[Math.PI / 2, 0, 0]} scale={1.5}>
      {/* Enclosure */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials["Material.001"]}
        position={[0.016, 0, 0.016]}
        scale={[1.37, 0.1, 1.63]} // Increased width and overall scale
      >
        {/* Button (Cylinder) */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder.geometry}
          material={materials["Material.002"]}
          position={[-0.66, 1.461, -0.677]}
          scale={[0.237, 0.47, 0.163]}
          onClick={handleButtonClick} // Handle click on the cylinder
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/assets/3d/xray.glb");

const XRayComponent = ({ isPaused, setIsPaused }: XRayEnclosureProps) => {
  return (
    <div className="w-52 h-96 rounded-lg mr-4 relative">
      <Canvas>
        <ambientLight intensity={4} />
        <XRayEnclosure isPaused={isPaused} setIsPaused={setIsPaused} />
      </Canvas>
    </div>
  );
};

export default XRayComponent;
