import React, { useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Portal(props) {
  const { nodes, materials } = useGLTF("/2025/assets/explore/models/portal.glb");
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group
        {...props}
        dispose={null}
        position={[-4, -3.6, -3]}
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 1.5, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Plane002 as THREE.Mesh)?.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Plane004 as THREE.Mesh).geometry}
          material={materials["Material.003"]}
          position={[0, -0.476, 0]}
          scale={[2.414, 1, 1.557]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Plane as THREE.Mesh).geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Plane001 as THREE.Mesh).geometry}
          material={materials["Material.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Plane003 as THREE.Mesh).geometry}
          material={
            new THREE.MeshPhysicalMaterial({
              roughness: 0.2, // Smooth surface
              metalness: 0.4, // Not metallic
              transmission: 0.7, // Makes it transparent like glass
              transparent: true,
              opacity: 1, // Keep opacity at 1 when using transmission
              ior: 1.5, // Index of Refraction (adjust for different glass types)
              thickness: 0.3, // Adjust for depth effect
              color: 0x00ffcc,
              side: THREE.DoubleSide,
            })
          }
          position={[0, 0.917, 0]}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Stone_Slab as THREE.Mesh).geometry}
          material={(nodes.Stone_Slab as THREE.Mesh).material}
          position={[1.323, 0.028, 0.575]}
          rotation={[Math.PI, -0.025, Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cube001 as THREE.Mesh).geometry}
          material={(nodes.Cube001 as THREE.Mesh).material}
          position={[-1.046, 0.02, -0.122]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={1.185}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cube003 as THREE.Mesh).geometry}
          material={(nodes.Cube003 as THREE.Mesh).material}
          position={[-0.169, 0.02, -0.192]}
          rotation={[0, 0.102, 0]}
          scale={1.297}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube004.geometry}
          material={nodes.Cube004.material}
          position={[-1.312, 0.025, 0.522]}
          rotation={[0, 0.297, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005.geometry}
          material={nodes.Cube005.material}
          position={[0.711, 0.015, -0.198]}
          rotation={[0, -0.003, 0]}
          scale={1.095}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002.geometry}
          material={nodes.Cube002.material}
          position={[-1.845, -0.457, 1.104]}
          rotation={[3.04, -0.015, -3.136]}
          scale={1.072}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006.geometry}
          material={nodes.Cube006.material}
          position={[-1.026, -0.476, 1.131]}
          rotation={[0, 0.014, 0]}
          scale={1.072}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube007.geometry}
          material={nodes.Cube007.material}
          position={[1.664, -0.475, 0.979]}
          rotation={[0.039, 0.466, 0.094]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube008.geometry}
          material={nodes.Cube008.material}
          position={[-1.715, -0.442, 0.034]}
          rotation={[0.028, 0.018, 0.014]}
          scale={1.072}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube009.geometry}
          material={nodes.Cube009.material}
          position={[-2.642, -0.705, -0.17]}
          rotation={[-0.122, -0.145, 0.448]}
          scale={1.335}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube010.geometry}
          material={nodes.Cube010.material}
          position={[1.815, -0.451, -0.267]}
          rotation={[Math.PI, -0.025, Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube011.geometry}
          material={nodes.Cube011.material}
          position={[1.975, -0.404, 0.192]}
          rotation={[Math.PI, -0.025, Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube012.geometry}
          material={nodes.Cube012.material}
          position={[0.342, -0.476, -0.973]}
          rotation={[0, 0.025, 0]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube013.geometry}
          material={nodes.Cube013.material}
          position={[-0.461, -0.476, -1.099]}
          rotation={[0, 0.025, 0]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014.geometry}
          material={nodes.Cube014.material}
          position={[-1.809, -0.21, -1.014]}
          rotation={[-0.107, -0.75, 0.655]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube015.geometry}
          material={nodes.Cube015.material}
          position={[0.281, 0.018, 0.271]}
          rotation={[0, -0.003, 0]}
          scale={1.095}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube016.geometry}
          material={nodes.Cube016.material}
          position={[1.828, -0.952, 1.79]}
          rotation={[-Math.PI, 0.84, -Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017.geometry}
          material={nodes.Cube017.material}
          position={[2.414, -0.952, 1.53]}
          rotation={[Math.PI, -0.961, Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube018.geometry}
          material={nodes.Cube018.material}
          position={[-1.213, -0.95, 2.06]}
          rotation={[Math.PI, -0.627, Math.PI]}
          scale={1.138}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cube019 as THREE.Mesh).geometry}
          material={(nodes.Cube019 as THREE.Mesh).material}
          position={[-1.692, -0.88, 1.963]}
          rotation={[0.02, 0.07, 0.161]}
          scale={1.138}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/2025/assets/explore/models/portal.glb");
