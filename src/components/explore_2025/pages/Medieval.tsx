import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "~/components/explore_2025/controllers/characterController";
import { Map } from "~/components/explore_2025/Map";

const maps = {
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, -10, -6],
    rotation: [10, 0],
  },
};

export const Experience = () => {
  return (
    <Physics key="medieval_fantasy_book">
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          // ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Map
        scale={maps.medieval_fantasy_book.scale}
        position={maps.medieval_fantasy_book.position}
        model={`models/medieval_fantasy_book_bloom.glb`}
      />
      <CharacterController />
    </Physics>
  );
};
