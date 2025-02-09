import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function MasalaModel(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "2025/Pronites/guitarist.glb"
  );
  const { actions } = useAnimations(animations, group);

  // Start the first animation once the component mounts.
  useEffect(() => {
    if (animations.length && actions) {
      // Replace "AnimationName" with the name of the animation you want to play,
      // or use animations[0].name if you want the first animation.
      const animName = animations[0].name;
      actions[animName]?.play();
    }
  }, [animations, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Sketchfab_model"
          position={[0.006, 0.484, 0.545]}
          rotation={[-Math.PI / 2, 0, -Math.PI]}
          scale={11.053}
        >
          <group
            name="ac0a8ed039f743179f83cff933aebc86fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.001}
          >
            <group name="RootNode">
              <group
                name="BookHolder_low"
                position={[1.137, 33.267, -19.448]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[1.059, 1, 1]}
              >
                <group name="Object_69" position={[0, 0.537, 0.573]}>
                  <mesh
                    name="BookHolder_low_Piano_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.BookHolder_low_Piano_0.geometry}
                    material={materials["Piano.001"]}
                  />
                </group>
              </group>
              <group
                name="Chord_low"
                position={[5.768, -10.106, -10.952]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Chord_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Chord_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Dial_low"
                position={[-64.431, 23.734, 12.087]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Dial_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Dial_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Felt_low"
                position={[0, 21.94, 6.33]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Felt_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Felt_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Guard_Left_low"
                position={[-64.587, 20.458, 2.14]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Guard_Left_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Guard_Left_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Guard_Right_low"
                position={[64.572, 20.458, 2.14]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Guard_Right_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Guard_Right_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Main_Bottom_low"
                position={[0, 13.436, 1.147]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Main_Bottom_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Main_Bottom_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Main_Middle_low"
                position={[0, 18.647, 1.706]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Main_Middle_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Main_Middle_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="MainBoard_Dials_low"
                position={[-7.794, 24.346, -7.475]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="MainBoard_Dials_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.MainBoard_Dials_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="MainBoard_low"
                position={[0, 21.517, -8.917]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="MainBoard_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.MainBoard_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Piano_Keybed_low"
                position={[0, 19.955, 11.089]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Piano_Keybed_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Piano_Keybed_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="PianoKeys_low"
                position={[0.051, 19.921, 13.138]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="PianoKeys_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.PianoKeys_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Speaker_Grate_Left_low"
                position={[-48.842, 21.177, -9.041]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Speaker_Grate_Left_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Speaker_Grate_Left_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Speaker_Grate_Right_low"
                position={[48.842, 21.177, -9.041]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Speaker_Grate_Right_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Speaker_Grate_Right_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Speaker_Left_low"
                position={[-48.842, 20.513, -8.829]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Speaker_Left_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Speaker_Left_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Speaker_Right_low"
                position={[48.842, 20.513, -8.829]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Speaker_Right_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Speaker_Right_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stand_Board_Left_low"
                position={[-67.737, -12.311, -4.586]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Board_Left_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Board_Left_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Board_Right_low"
                position={[67.737, -12.311, -4.586]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Board_Right_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Board_Right_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Bracket00_low"
                position={[-64.542, 9.766, 3.974]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Bracket00_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Bracket00_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stand_Bracket01_high002"
                position={[-64.542, 9.769, -11.261]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1, 1.148, 1]}
              >
                <group name="Object_6" position={[0.286, -0.405, -1.959]}>
                  <mesh
                    name="Stand_Bracket01_high002_Piano_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Stand_Bracket01_high002_Piano_0.geometry}
                    material={materials["Piano.001"]}
                  />
                </group>
              </group>
              <group
                name="Stand_Bracket01_high003"
                position={[64.542, 9.769, -11.261]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Bracket01_high003_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Bracket01_high003_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stand_Bracket03_low"
                position={[64.542, 9.766, 3.974]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Bracket03_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Bracket03_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stand_Bracket_Left_low"
                position={[-65.251, -5.84, -4.564]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Bracket_Left_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Bracket_Left_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Bracket_Right_low"
                position={[65.251, -5.84, -4.564]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Bracket_Right_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Bracket_Right_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Foot_Left_low"
                position={[-67.737, -40.193, -0.512]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Foot_Left_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Foot_Left_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Foot_Right_low"
                position={[67.737, -40.193, -0.512]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Foot_Right_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Foot_Right_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stand_Middle_low"
                position={[0, -5.84, -4.586]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stand_Middle_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stand_Middle_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="Stub_00_low"
                position={[-61.219, 11.567, 19.635]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stub_00_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stub_00_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stub_01_low"
                position={[-60.84, 11.567, -17.257]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stub_01_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stub_01_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stub_02_low"
                position={[63.625, 11.567, 19.635]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stub_02_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stub_02_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="Stub_03_low"
                position={[63.246, 11.567, -17.257]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Stub_03_low_Piano_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Stub_03_low_Piano_0.geometry}
                  material={materials["Piano.001"]}
                />
              </group>
              <group
                name="SustainBase_low"
                position={[0, -39.76, 1.706]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="SustainBase_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.SustainBase_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
              <group
                name="SustainPedal_low"
                position={[0, -38.078, 2.857]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="SustainPedal_low_Stand_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.SustainPedal_low_Stand_0.geometry}
                  material={materials["Stand.001"]}
                />
              </group>
            </group>
          </group>
        </group>
        <group
          name="Sketchfab_model001"
          position={[0, 0, 0.056]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1.108}
        >
          <group
            name="bar_stool_01fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="RootNode001">
              <group name="low">
                <group name="bolt_01_lp">
                  <mesh
                    name="bolt_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_02_lp">
                  <mesh
                    name="bolt_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_03_lp">
                  <mesh
                    name="bolt_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_04_lp">
                  <mesh
                    name="bolt_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_05_lp">
                  <mesh
                    name="bolt_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_05_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_06_lp">
                  <mesh
                    name="bolt_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_06_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_07_lp">
                  <mesh
                    name="bolt_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_07_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_08_lp">
                  <mesh
                    name="bolt_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_08_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_09_lp">
                  <mesh
                    name="bolt_09_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_09_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_10_lp">
                  <mesh
                    name="bolt_10_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_10_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_11_lp">
                  <mesh
                    name="bolt_11_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_11_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_12_lp">
                  <mesh
                    name="bolt_12_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_12_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_13_lp">
                  <mesh
                    name="bolt_13_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_13_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_01_lp">
                  <mesh
                    name="foot_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_02_lp">
                  <mesh
                    name="foot_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_03_lp">
                  <mesh
                    name="foot_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_04_lp">
                  <mesh
                    name="foot_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="leg_01_lp">
                  <mesh
                    name="leg_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="leg_02_lp">
                  <mesh
                    name="leg_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_01_lp">
                  <mesh
                    name="nut_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_02_lp">
                  <mesh
                    name="nut_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_03_lp">
                  <mesh
                    name="nut_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_04_lp">
                  <mesh
                    name="nut_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_05_lp">
                  <mesh
                    name="nut_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_05_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_06_lp">
                  <mesh
                    name="nut_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_06_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_07_lp">
                  <mesh
                    name="nut_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_07_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_08_lp">
                  <mesh
                    name="nut_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_08_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="pillow_lp">
                  <mesh
                    name="pillow_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.pillow_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="plate_01_lp">
                  <mesh
                    name="plate_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="plate_02_lp">
                  <mesh
                    name="plate_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="ring_01_lp">
                  <mesh
                    name="ring_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="ring_02_lp">
                  <mesh
                    name="ring_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials["PackedMaterial0mat.001"]}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Bottoms"
            geometry={nodes.Bottoms.geometry}
            material={materials["PackedMaterial0mat.001"]}
            skeleton={nodes.Bottoms.skeleton}
          />
          <skinnedMesh
            name="default"
            geometry={nodes["default"].geometry}
            material={materials["PackedMaterial0mat.001"]}
            skeleton={nodes["default"].skeleton}
          />
          <skinnedMesh
            name="Shoes"
            geometry={nodes.Shoes.geometry}
            material={materials["PackedMaterial0mat.001"]}
            skeleton={nodes.Shoes.skeleton}
          />
          <skinnedMesh
            name="Tops"
            geometry={nodes.Tops.geometry}
            material={materials["PackedMaterial0mat.001"]}
            skeleton={nodes.Tops.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("2025/Pronites/guitarist.glb");
