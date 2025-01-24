import React, { useEffect, useRef, useState, useMemo } from "react";

import { gsap } from "gsap";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
const thumbnailSrc = "/thumbnails/incridea23.jpg";
import PreviewComponent from "../previewComponent/preview-component";
import Modal from "../gallery-modal";
import Image from "next/image";

const Model: React.FC<{ ropeCurve: THREE.CatmullRomCurve3 }> = ({
  ropeCurve,
}) => {
  const modelRef = useRef<THREE.Group | null>(null);
  const [gltf, setGltf] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/3d/portal.glb",
      (loadedGltf) => {
        setGltf(loadedGltf.scene);
      },
      undefined,
      (error) => console.error("Error loading GLB model:", error),
    );
  }, []);

  const middlePosition = useMemo(() => {
    const t = 0.5;
    const position = ropeCurve.getPointAt(t);
    position.y -= 2;

    return position;
  }, [ropeCurve]);

  if (!gltf) return null;

  return (
    <mesh rotation={[-0.2, -0.35, 0]}>
      <primitive
        object={gltf}
        ref={modelRef}
        position={middlePosition.toArray()}
        scale={[3, 3, 3]}
      />
    </mesh>
  );
};

const MovingPhoto: React.FC<{
  imageUrl: string;
  startTime: number;
  ropeCurve: THREE.CatmullRomCurve3;
  isMoving: boolean;
  onUpdateHookPosition: (pos: THREE.Vector3) => void;
  handleClick: (event: THREE.Event, imageUrl: string) => void;
}> = ({
  imageUrl,
  startTime,
  ropeCurve,
  isMoving,
  onUpdateHookPosition,
  handleClick,
}) => {
  const [position, setPosition] = useState(new THREE.Vector3());
  const squareRef = useRef<THREE.Mesh | null>(null);
  const animationFrameIdRef = useRef<number>();

  const squareRotation = useRef(0);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      imageUrl,
      () => console.log(`Texture loaded: ${imageUrl}`),
      undefined,
    );
  }, [imageUrl]);

  useEffect(() => {
    const animate = () => {
      const time = (Date.now() + startTime) % 6000;
      const t = (time / 6000) % 5;
      const newPosition = ropeCurve.getPointAt(t);
      const offsetY = -2.2;
      newPosition.y += offsetY;

      const hookOffset = new THREE.Vector3(0, 1.6, 0);
      const hookPos = newPosition.clone().add(hookOffset);

      setPosition(newPosition);
      onUpdateHookPosition(hookPos);

      if (isMoving) {
        animationFrameIdRef.current = requestAnimationFrame(animate);

        gsap.to(squareRotation, {
          current: -15,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            if (squareRef.current) {
              squareRef.current.rotation.z = THREE.MathUtils.degToRad(
                squareRotation.current,
              );
            }
          },
        });
      }
    };

    if (isMoving) {
      animate();
    } else {
      gsap.to(squareRotation, {
        current: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          if (squareRef.current) {
            squareRef.current.rotation.z = THREE.MathUtils.degToRad(
              squareRotation.current,
            );
          }
        },
      });

      cancelAnimationFrame(animationFrameIdRef.current!);
    }

    return () => cancelAnimationFrame(animationFrameIdRef.current!);
  }, [isMoving, ropeCurve, startTime, onUpdateHookPosition]);

  return (
    <mesh
      position={position}
      ref={squareRef}
      onClick={(event) => handleClick(event, imageUrl)}
    >
      <planeGeometry args={[2.3, 2.3]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.5} />
    </mesh>
  );
};

const RopeStructure: React.FC<{
  imageUrls: string[];
  isMoving: boolean;
  onUpdateHookPosition: (index: number, pos: THREE.Vector3) => void;
  handleClick: (event: THREE.Event, imageUrl: string) => void;
}> = ({ imageUrls, isMoving, onUpdateHookPosition, handleClick }) => {
  const { size, camera } = useThree();

  const points = useMemo<THREE.Vector3[]>(() => {
    const aspect = size.width / size.height;
    const distance = camera.position.z;
    const height =
      camera instanceof THREE.PerspectiveCamera
        ? 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
        : size.height;
    const width = height * aspect;

    return [
      new THREE.Vector3(-width / 2, 6, 1),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(width / 2, 5, 1),
    ];
  }, [size, camera]);

  const ropeCurve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <>
      <mesh>
        <tubeGeometry args={[ropeCurve, 100, 0.05, 8, false]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {imageUrls.map((url, index) => (
        <MovingPhoto
          key={index}
          imageUrl={url}
          startTime={index * 3000}
          ropeCurve={ropeCurve}
          isMoving={isMoving}
          onUpdateHookPosition={(pos) => onUpdateHookPosition(index, pos)}
          handleClick={handleClick}
        />
      ))}
      <Model ropeCurve={ropeCurve} />
    </>
  );
};

const Inc20 = ({ imageUrls }: { imageUrls: string[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState(false);

  const [isMovingForward, setIsMovingForward] = useState(true);
  const [hookPositions, setHookPositions] = useState<THREE.Vector3[]>(
    imageUrls.map(() => new THREE.Vector3()),
  );
  const handleClick = (event: THREE.Event, imageUrl: string) => {
    const index = imageUrls.indexOf(imageUrl);
    if (index !== -1) {
      setActiveIndex(index);
      setActiveModal(true);
    }
  };
  const closeModal = () => setActiveModal(false);

  const toggleMovement = () => {
    setIsMovingForward((prev) => !prev);
  };

  const updateHookPosition = (index: number, newPosition: THREE.Vector3) => {
    setHookPositions((prev) =>
      prev.map((pos, i) => (i === index ? newPosition : pos)),
    );
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <Canvas
            className="absolute top-0 left-0 w-full h-full"
            camera={{ position: [0, 0, 10] }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <RopeStructure
              imageUrls={imageUrls}
              isMoving={isMovingForward}
              onUpdateHookPosition={updateHookPosition}
              handleClick={handleClick}
            />
            {hookPositions.map((hookPos, index) => (
              <mesh position={hookPos} key={index}>
                <cylinderGeometry args={[0.1, 0.1, 1, 20]} />
                <meshStandardMaterial
                  color="#E17564"
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            ))}
          </Canvas>
          {activeModal && activeIndex !== null && (
            <Modal showModal={activeModal} onClose={closeModal} title="">
              <PreviewComponent
                imgArr={imageUrls}
                index={activeIndex}
                thumbnailSrc={thumbnailSrc}
                afterMovieLink="gmF72fu1w6A"
              />
            </Modal>
          )}

          <Image
            src="/assets/png/toggle-button.png"
            alt="Toggle Movement"
            width={54}
            height={54}
            className="cursor-pointer opacity-86 absolute bottom-[17%] left-[56%] transform translate-x-[50%] -translate-y-[60%]  sm:bottom-[14%] sm:left-[50%] sm:width-[48px] sm:height-[48px] md:width-[58px] md:height-[58px]"
            onClick={toggleMovement}
          />
        </div>
      </div>
    </>
  );
};

export default Inc20;
