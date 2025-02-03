import { Cloud, Clouds, KeyboardControls, Sky as SkyImpl } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Experience } from "~/components/explore_2025/pages/Medieval";
import {
  Bloom, ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { Suspense, useRef } from "react";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

function Medieval() {

  return (
    <div className="h-screen w-screen">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 0], near: 0.1, fov: 40 }}
          style={{
            touchAction: "none",
          }}
          gl={{antialias: false, pixelRatio: 0.01}}
        >
          <fog attach="fog" args={["white", 1, 20]} />
          <color attach="background" args={["#1c1c1c"]} />
          <Sky/>
          <Suspense>
            <Experience />
          </Suspense>
          <EffectComposer disableNormalPass>
            {/*<ChromaticAberration*/}
            {/*  radialModulation={true}*/}
            {/*  modulationOffset={0.1}*/}
            {/*  opacity={1}*/}
            {/*/>*/}
            <Vignette eskil={false} offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

function Sky() {
  const ref = useRef()
  const cloud0 = useRef()

  const config = {
    segments: 20,
    volume: 6,
    opacity: 0.6,
    fade: 10,
    growth: 4,
    speed: 0.01,
  }

  const x = 6, y = 1, z = 10;
  const color = "white";

  useFrame((state, delta) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 4) / 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) / 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cloud0.current.rotation.y -= delta * 0.5
  })

  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={50}>
          <Cloud ref={cloud0} {...config} bounds={[x, y, z]} color={color} />
          <Cloud {...config} bounds={[x, y, z]} color="#eed0d0" seed={2} position={[15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z]} color="#d0e0d0" seed={3} position={[-15, 0, 0]} />
          <Cloud {...config} bounds={[x, y, z]} color="#a0b0d0" seed={4} position={[0, 0, -12]} />
          <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={5} position={[0, 0, 12]} />
          <Cloud concentrate="outside" growth={100} color="#ffccdd" opacity={1.25} seed={0.3} bounds={200} volume={200} />
        </Clouds>
      </group>
    </>
  )
}


export default Medieval;
