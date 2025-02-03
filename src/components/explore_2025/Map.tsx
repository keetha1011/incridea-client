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
  const { scene, animations } = useGLTF(
    "/explore/assets/models/medieval_bounded.glb"
  );
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        if (child.name !== "Cube") {
          child.castShadow = true;
          child.receiveShadow = true;
        } else {
          child.material = new THREE.MeshBasicMaterial({ visible: false });
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      actions[animations[0].name].play();
    }
  }, [actions]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} {...props} ref={group} />
      </RigidBody>
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
