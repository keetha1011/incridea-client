import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Shaan(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/2025/Pronites/shaan.glb");
  const { actions } = useAnimations(animations, group);

  // Start the first animation once the component mounts.
  useEffect(() => {
    if (animations.length && actions) {
      const animName = animations[1].name;
      actions[animName]?.play();
    }
  }, [animations, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={2.604}>
          <skinnedMesh
            name="avaturn_body001"
            geometry={nodes.avaturn_body001.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0001"
            geometry={nodes.avaturn_hair_0001.geometry}
            material={nodes.avaturn_hair_0001.material}
            skeleton={nodes.avaturn_hair_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1001"
            geometry={nodes.avaturn_hair_1001.geometry}
            material={materials["Material.001"]}
            skeleton={nodes.avaturn_hair_1001.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0001"
            geometry={nodes.avaturn_look_0001.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0001"
            geometry={nodes.avaturn_shoes_0001.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0001.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
        <group
          name="Object_3_124"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_126">
            <group name="_125">
              <mesh
                name="Object_49"
                castShadow
                receiveShadow
                geometry={nodes.Object_49.geometry}
                material={materials["BodyMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_9_142"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_144">
            <group name="_143">
              <mesh
                name="Object_73"
                castShadow
                receiveShadow
                geometry={nodes.Object_73.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_14_157"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_159">
            <group name="_158">
              <mesh
                name="Object_93"
                castShadow
                receiveShadow
                geometry={nodes.Object_93.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_19_172"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_174">
            <group name="_173">
              <mesh
                name="Object_113"
                castShadow
                receiveShadow
                geometry={nodes.Object_113.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_20_175"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_177">
            <group name="_176">
              <mesh
                name="Object_117"
                castShadow
                receiveShadow
                geometry={nodes.Object_117.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_21_178"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_180">
            <group name="_179">
              <mesh
                name="Object_121"
                castShadow
                receiveShadow
                geometry={nodes.Object_121.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_22_181"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_183">
            <group name="_182">
              <mesh
                name="Object_125"
                castShadow
                receiveShadow
                geometry={nodes.Object_125.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_23_184"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_186">
            <group name="_185">
              <mesh
                name="Object_129"
                castShadow
                receiveShadow
                geometry={nodes.Object_129.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_26_193"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_195">
            <group name="_194">
              <mesh
                name="Object_141"
                castShadow
                receiveShadow
                geometry={nodes.Object_141.geometry}
                material={materials["MetalPartsMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_27_196"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_198">
            <group name="_197">
              <mesh
                name="Object_145"
                castShadow
                receiveShadow
                geometry={nodes.Object_145.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_28_199"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_201">
            <group name="_200">
              <mesh
                name="Object_149"
                castShadow
                receiveShadow
                geometry={nodes.Object_149.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_29_202"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_204">
            <group name="_203">
              <mesh
                name="Object_153"
                castShadow
                receiveShadow
                geometry={nodes.Object_153.geometry}
                material={materials["StringMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_31_208"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_210">
            <group name="_209">
              <mesh
                name="Object_161"
                castShadow
                receiveShadow
                geometry={nodes.Object_161.geometry}
                material={materials["NeckMaterial.001"]}
              />
            </group>
          </group>
        </group>
        <group
          name="Object_32_211"
          position={[-0.377, 2.298, 0.478]}
          rotation={[2.863, 0.317, 0.043]}
          scale={0.009}
        >
          <group name="_213">
            <group name="_212">
              <mesh
                name="Object_165"
                castShadow
                receiveShadow
                geometry={nodes.Object_165.geometry}
                material={materials["NeckMaterial.001"]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/2025/Pronites/shaan.glb");
