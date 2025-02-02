import React, { Suspense, useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

function Model() {
  const gltf = useLoader(
    GLTFLoader,
    "assets/3d/pendulum_clock.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    },
  );

  const nodes = (gltf.nodes as Record<string, THREE.Mesh>) || {};
  const materials = (gltf.materials as Record<string, THREE.Material>) || {};
  const pendulumGroupRef = useRef<THREE.Group>(null);
  const limitr = Math.PI / 4;
  const limitl = -Math.PI / 4;

  useEffect(() => {
    if (pendulumGroupRef.current) {
      pendulumGroupRef.current.rotation.z = limitl;
      gsap.to(pendulumGroupRef.current.rotation, {
        z: limitr,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  // useEffect(() => {
  //   if (pendulumGroupRef.current) {
  //     Draggable.create(pendulumGroupRef.current.rotation, {
  //       type: 'rotation',
  //       inertia: true,
  //       bounds: { minRotation: -limit, maxRotation: limit },
  //       onDrag: function () {
  //         if (this.rotation <= -limit) console.log('Reached left limit');
  //         if (this.rotation >= limit) console.log('Reached right limit');
  //       },
  //     });
  //   }
  // }, []);

  return (
    <group dispose={null} scale={[0.07, 0.07, 0.07]} position={[0, -5, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ClockFace?.geometry}
        material={materials["Material #14"]}
        position={[-0.115, 61.298, -49.81]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={0.507}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arms?.geometry}
        material={materials["Material #14"]}
        position={[25.749, 33.775, -42.821]}
        rotation={[Math.PI, -1.571, 0]}
        scale={0.321}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Base?.geometry}
        material={materials["Material #14"]}
        position={[0.011, -2.458, -42.21]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={0.321}
      />
      <group ref={pendulumGroupRef} position={[0.674, 42.0, -42.537]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Pendulum?.geometry}
          material={materials["Material #8"]}
          position={[0, -12.786, 0]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={0.321}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.PendulumBob?.geometry}
            material={materials["Material #8"]}
            position={[0, -10, 0]}
            scale={0.7}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </mesh>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ImageMesh?.geometry}
        material={nodes.ImageMesh?.material}
        position={[-0.29, 61.128, -50.793]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={19.567}
      />
    </group>
  );
}

const Inc23 = ({ imgArr }: { imgArr: string[] }) => {
  return (
    <Canvas>
      <ambientLight intensity={15} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
};

export default Inc23;
