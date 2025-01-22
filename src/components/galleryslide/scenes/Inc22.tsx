import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";

const Inc22 = ({ imgArr }: { imgArr: string[] }) => {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const thumbnailSrc = "/thumbnails/incridea22.jpg";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = new THREE.TextureLoader();
      const loadedTextures = imgArr.map((img) => loader.load(img));
      setTextures(loadedTextures);
    }
  }, [imgArr]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === containerRef.current) {
            if (entry.isIntersecting) {
              containerRef.current?.classList.remove("paused");
            } else {
              containerRef.current?.classList.add("paused");
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative">
      <Modal
        showModal={activeModal}
        title="test"
        onClose={() => setActiveModal(false)}
      >
        <PreviewComponent
          imgArr={imgArr}
          index={activeIndex}
          afterMovieLink="gmF72fu1w6A"
          thumbnailSrc={thumbnailSrc}
        />
      </Modal>
      <Canvas
        camera={{
          position: [0, 0, 10],
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        {textures.length > 0 && (
          <PhotoGallery
            photos={textures}
            setActiveModal={setActiveModal}
            setActiveIndex={setActiveIndex}
            isPaused={containerRef.current?.classList.contains("paused")}
          />
        )}
      </Canvas>
    </div>
  );
};

const PhotoGallery = ({
  photos,
  setActiveModal,
  setActiveIndex,
  isPaused,
}: {
  photos: THREE.Texture[];
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean | undefined;
}) => {
  const { size, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const photoRefs = useRef<THREE.Group[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const ropePoints = useMemo(() => {
    const aspect = size.width / size.height;
    const distance = camera.position.z;
    const height =
      camera instanceof THREE.PerspectiveCamera
        ? 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
        : size.height;
    const width = height * aspect;

    const offset = window.innerWidth < 768 ? 0.4 : 0.7;
    const initial = window.innerWidth < 768 ? 0.5 : 1;

    return [
      new THREE.Vector3(-width / 2 - 4, 6 * offset, 0),
      new THREE.Vector3(-width / 4, initial * offset, 0),
      new THREE.Vector3(0, -0.3 * offset, 0),
      new THREE.Vector3(width / 4, initial * offset, 0),
      new THREE.Vector3(width / 2 + 4, 6 * offset, 0),
    ];
  }, [size, camera]);

  const ropeCurve = useMemo(
    () => new THREE.CatmullRomCurve3(ropePoints),
    [ropePoints],
  );

  const animate = useCallback(() => {
    if (!isPaused) {
      timeRef.current += 1;

      photoRefs.current.forEach((photoGroup) => {
        let position =
          (photoGroup.userData.offset + timeRef.current * 0.0002) % 1;
        if (position < 0) position += 1;

        const point = ropeCurve.getPointAt(position);
        const tangent = ropeCurve.getTangentAt(position);

        photoGroup.position.copy(point);

        const up = new THREE.Vector3(0, 1, 0);
        const axis = new THREE.Vector3().crossVectors(up, tangent);
        const radians = Math.acos(up.dot(tangent));
        photoGroup.setRotationFromAxisAngle(axis, radians);

        photoGroup.rotation.x =
          Math.cos(
            timeRef.current * 0.02 + photoGroup.userData.offset * Math.PI * 2,
          ) * 0.1;
        photoGroup.rotation.y =
          Math.sin(
            timeRef.current * 0.02 + photoGroup.userData.offset * Math.PI * 2,
          ) * 0.1;
        photoGroup.rotation.z =
          Math.sin(
            timeRef.current * 0.02 + photoGroup.userData.offset * Math.PI * 2,
          ) * 0.1;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [ropeCurve, isPaused]);

  useEffect(() => {
    if (!groupRef.current) return;

    photoRefs.current = [];
    while (groupRef.current.children.length > 0) {
      if (groupRef.current.children[0]) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
    }

    photos.forEach((texture, index) => {
      const photoGroup = new THREE.Group();
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 3.5, 0.005),
        new THREE.MeshStandardMaterial({ map: texture, color: "white" }),
      );
      const lineMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.1),
        new THREE.MeshStandardMaterial({ color: "white" }),
      );

      if (window.innerWidth < 768) {
        mesh.position.set(0, -1.6, 0);
        mesh.scale.set(0.65, 0.65, 0.65);
      } else {
        mesh.position.set(0, -3, 0);
        mesh.scale.set(1.2, 1.2, 1.2);
      }
      lineMesh.position.set(0, -0.5, -0.05);
      photoGroup.add(mesh);
      photoGroup.add(lineMesh);
      photoGroup.userData = {
        index,
        offset: index / photos.length,
      };

      photoRefs.current.push(photoGroup);
      groupRef.current?.add(photoGroup);
    });

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [photos, animate]);

  const handleClick = (event: THREE.Event) => {
    const clickedPhoto = photoRefs.current.find(
      (photo) =>
        photo ===
        (event as THREE.Event & { object: THREE.Object3D }).object.parent,
    );

    if (clickedPhoto) {
      const index = photoRefs.current.indexOf(clickedPhoto);
      setActiveIndex(index);
      setActiveModal(true);
    }
  };

  return (
    <>
      <group ref={groupRef}>
        {photoRefs.current.map((photoGroup, index) => (
          <primitive object={photoGroup} key={index} onClick={handleClick} />
        ))}
      </group>
      <mesh>
        <tubeGeometry args={[ropeCurve, 64, 0.05, 8, false]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <ambientLight intensity={1} />
    </>
  );
};

export default Inc22;
