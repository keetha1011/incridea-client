import { useGLTF, useAnimations } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import type * as THREE from "three";
import { type GLTF } from "three-stdlib";

import { env } from "~/env";

type GLTFResult = GLTF & {
  nodes: {
    avaturn_body: THREE.SkinnedMesh;
    avaturn_hair_0: THREE.SkinnedMesh;
    avaturn_hair_1: THREE.SkinnedMesh;
    avaturn_look_0: THREE.SkinnedMesh;
    avaturn_shoes_0: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
  };
  materials: {
    ["avaturn_body_material.001"]: THREE.MeshStandardMaterial;
    ["avaturn_hair_0_material.001"]: THREE.MeshStandardMaterial;
    ["avaturn_hair_1_material.001"]: THREE.MeshStandardMaterial;
    ["avaturn_look_0_material.001"]: THREE.MeshStandardMaterial;
    ["avaturn_shoes_0_material.001"]: THREE.MeshStandardMaterial;
  };
};

export default function Dhvani(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/3d/dhvaniAnimated.glb`,
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Armature|mixamo.com|Layer0"]?.reset().play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="avaturn_body"
            geometry={nodes.avaturn_body.geometry}
            material={materials["avaturn_body_material.001"]}
            skeleton={nodes.avaturn_body.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0"
            geometry={nodes.avaturn_hair_0.geometry}
            material={materials["avaturn_hair_0_material.001"]}
            skeleton={nodes.avaturn_hair_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1"
            geometry={nodes.avaturn_hair_1.geometry}
            material={materials["avaturn_hair_1_material.001"]}
            skeleton={nodes.avaturn_hair_1.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0"
            geometry={nodes.avaturn_look_0.geometry}
            material={materials["avaturn_look_0_material.001"]}
            skeleton={nodes.avaturn_look_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0"
            geometry={nodes.avaturn_shoes_0.geometry}
            material={materials["avaturn_shoes_0_material.001"]}
            skeleton={nodes.avaturn_shoes_0.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(
  `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/3d/dhvaniAnimated.glb`,
);
