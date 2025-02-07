import {
  useAnimations,
  useGLTF,
  Cloud,
  Clouds,
  Sky as SkyImpl,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

// @ts-ignore
export const Map = ({ model, ...props }) => {
  const { nodes, materials, animations } = useGLTF(
    "/2025/assets/explore/models/medieval_bounded.glb"
  );
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      actions[animations[0].name].play();
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh">
        <group name="Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
            <group
              name="dad255dd2cf24ae0bb357684e49722b4fbx"
              rotation={[Math.PI / 2, 0, 0]}
            >
              <group name="Object_2">
                <group name="RootNode">
                  <group
                    name="deers"
                    position={[-23.122, -0.049, 14.878]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_26" position={[4.328, 30.387, 4.387]}>
                      <mesh
                        name="deers_Texture-base_0"
                        castShadow
                        receiveShadow
                        geometry={nodes["deers_Texture-base_0"].geometry}
                        material={materials["Texture-base"]}
                      />
                    </group>
                  </group>
                  <group
                    name="flag"
                    position={[-11.513, 12.497, -6.752]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 6]}
                  >
                    <group name="Object_17" position={[-7.262, 9.035, -8.16]}>
                      <mesh
                        name="0"
                        castShadow
                        receiveShadow
                        geometry={nodes["0"].geometry}
                        material={materials["Texture-base"]}
                        morphTargetDictionary={nodes["0"].morphTargetDictionary}
                        morphTargetInfluences={nodes["0"].morphTargetInfluences}
                      />
                    </group>
                  </group>
                  <group
                    name="flag-second"
                    position={[-11.494, 12.552, -26.245]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_20" position={[-7.262, 9.035, -8.16]}>
                      <mesh
                        name="1"
                        castShadow
                        receiveShadow
                        geometry={nodes["1"].geometry}
                        material={materials["Texture-base"]}
                        morphTargetDictionary={nodes["1"].morphTargetDictionary}
                        morphTargetInfluences={nodes["1"].morphTargetInfluences}
                      />
                    </group>
                  </group>
                  <group
                    name="Scene_1"
                    position={[-4.794, 0, 0.278]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group
                      name="Mill-water-wheel"
                      position={[3.708, -15.395, -0.444]}
                      rotation={[-1.92, 0, 0]}
                    >
                      <group
                        name="Object_14"
                        position={[-17.708, 31.183, 4.781]}
                      >
                        <mesh
                          name="Mill-water-wheel_Texture-base_0"
                          castShadow
                          receiveShadow
                          geometry={
                            nodes["Mill-water-wheel_Texture-base_0"].geometry
                          }
                          material={materials["Texture-base"]}
                        />
                      </group>
                    </group>
                    <group
                      name="Mill-wind-wheel"
                      position={[-35.783, -27.192, 3.888]}
                      rotation={[0.445, -0.447, -0.498]}
                    >
                      <group
                        name="Object_11"
                        position={[-8.253, 39.884, -25.75]}
                        rotation={[-0.607, 0.138, 0.644]}
                      >
                        <mesh
                          name="Mill-wind-wheel_Texture-base_0"
                          castShadow
                          receiveShadow
                          geometry={
                            nodes["Mill-wind-wheel_Texture-base_0"].geometry
                          }
                          material={materials["Texture-base"]}
                        />
                      </group>
                    </group>
                    <group name="Object_5" position={[-14, 15.788, 4.337]}>
                      <mesh
                        name="Scene_Book-tittle_0"
                        castShadow
                        receiveShadow
                        geometry={nodes["Scene_Book-tittle_0"].geometry}
                        material={materials["Book-tittle"]}
                      />
                      <mesh
                        name="Scene_Texture-base-gloss-jpg_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes["Scene_Texture-base-gloss-jpg_0"].geometry
                        }
                        material={materials["Texture-base-gloss-jpg"]}
                      />
                      <mesh
                        name="Scene_Texture-base_0"
                        castShadow
                        receiveShadow
                        geometry={nodes["Scene_Texture-base_0"].geometry}
                        material={materials["Texture-base"]}
                      />
                      <mesh
                        name="Scene_Texture-base_0001"
                        castShadow
                        receiveShadow
                        geometry={nodes["Scene_Texture-base_0001"].geometry}
                        material={materials["Texture-base"]}
                      />
                    </group>
                  </group>
                  <group
                    name="Waterfall"
                    position={[-4.794, 0.1, 0.351]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_23" position={[-14, 15.788, 4.337]}>
                      <mesh
                        name="Waterfall_Texture-base-gloss-jpg_0"
                        castShadow
                        receiveShadow
                        geometry={
                          nodes["Waterfall_Texture-base-gloss-jpg_0"].geometry
                        }
                        material={materials["Texture-base-gloss-jpg"]}
                        position={[0, 0, -0.623]}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </RigidBody>
      <group
        name="Object_23"
        position={[-19, 4.9, -15.337]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <mesh
          name="Waterfall_Texture-base-gloss-jpg_0"
          castShadow
          receiveShadow
          geometry={nodes["Waterfall_Texture-base-gloss-jpg_0"].geometry}
          material={
            new THREE.MeshPhysicalMaterial({
              roughness: 0.3,
              metalness: 0.1,
              transmission: 1,
              transparent: true,
              opacity: 1,
              ior: 1.4,
              thickness: 0.1,
              color: 0x00bbcc,
              side: THREE.DoubleSide,
            })
          }
          position={[0, 0, -0.623]}
        />
      </group>
    </group>
  );
};

export const Sky = () => {
  const ref = useRef();
  const cloud0 = useRef();

  const config = {
    segments: 20,
    volume: 6,
    opacity: 1,
    fade: 10,
    growth: 4,
    speed: 0.01,
  };

  const x = 6,
    y = 1,
    z = 10;
  const color = "white";

  useFrame((state, delta) => {
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 4) / 2;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) / 2;
    cloud0.current.rotation.y -= delta * 0.5;
  });

  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={50}>
          <Cloud ref={cloud0} {...config} bounds={[x, y, z]} color={color} />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#eed0d0"
            seed={0.3}
            position={[15, 0, 0]}
          />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#d0e0d0"
            seed={0.7}
            position={[-15, 0, 0]}
          />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#a0b0d0"
            seed={0.2}
            position={[0, 0, -12]}
          />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#c0c0dd"
            seed={0.4}
            position={[0, 0, 12]}
          />
          <Cloud
            concentrate="outside"
            growth={100}
            color="#ffccdd"
            // opacity={1.25}
            seed={0.1}
            bounds={200}
            volume={200}
          />
        </Clouds>
      </group>
    </>
  );
};

useGLTF.preload("/2025/assets/explore/models/medieval_bounded.glb");