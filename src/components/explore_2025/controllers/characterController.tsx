import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MathUtils, Vector3, Raycaster } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Character } from "~/components/explore_2025/Character";

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }
  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const RUN_SPEED = 2.6;
  const WALK_SPEED = 0.8;
  const ROTATION_SPEED = degToRad(2);
  const rb = useRef<typeof RigidBody | null>(null);
  const container = useRef<THREE.Group>(null);
  const character = useRef<THREE.Group | null>(null);
  const [animation, setAnimation] = useState("idle");
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);
  const raycaster = useRef(new Raycaster()); // Create a Raycaster
  const cameraDirection = useRef(new Vector3());
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [spacebarDisabled, setSpacebarDisabled] = useState(false);
  const [paused, togglePause] = useState(false);

  function PauseToggler() {
    if (paused === true) {
      togglePause(false);
    } else {
      togglePause(true);
    }
  }

  const handleJump = () => {
    // Dispatch a keydown event for Space
    const keyDownEvent = new KeyboardEvent("keydown", {
      key: "Space",
      code: "Space",
      bubbles: true,
    });
    document.dispatchEvent(keyDownEvent);
  
    // After a short delay, dispatch the keyup event
    setTimeout(() => {
      const keyUpEvent = new KeyboardEvent("keyup", {
        key: "Space",
        code: "Space",
        bubbles: true,
      });
      document.dispatchEvent(keyUpEvent);
    }, 100);
  };

  useEffect(() => {
    const onMouseDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === "jump") return;
      if (target.id === "pause") {
        PauseToggler();
        return;
      }
      isClicking.current = true;
    };
    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === "jump") {
        handleJump();
        return;
      }
      isClicking.current = false;
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useFrame(({ camera, scene, mouse }) => {
    if (!paused) {
      if (rb.current) {
        const vel = rb.current.linvel();
        const pos = rb.current.translation();
        console.log(Math.floor(pos.x), Math.floor(pos.z));

        const movement = { x: 0, z: 0 };

        if (get().forward) movement.z = 1;
        if (get().backward) movement.z = -1;
        let speed = get().run ? RUN_SPEED : WALK_SPEED;

        if (isClicking.current) {
          if (Math.abs(mouse.x) > 0.1) movement.x = -mouse.x;
          movement.z = mouse.y + 0.4;
          if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5)
            speed = RUN_SPEED;
        }

        if (get().left) movement.x = 1;
        if (get().right) movement.x = -1;

        if (movement.x !== 0) {
          rotationTarget.current += ROTATION_SPEED * movement.x;
        }

        if (movement.x !== 0 || movement.z !== 0) {
          characterRotationTarget.current = Math.atan2(movement.x, movement.z);
          vel.x =
            Math.sin(rotationTarget.current + characterRotationTarget.current) *
            speed;
          vel.z =
            Math.cos(rotationTarget.current + characterRotationTarget.current) *
            speed;
          setAnimation(speed === RUN_SPEED ? "run" : "walk");
        } else {
          setAnimation("idle");
        }

        if (character.current) {
          character.current.rotation.y = lerpAngle(
            character.current.rotation.y,
            characterRotationTarget.current,
            0.1
          );
        }

        // Handle jumping
        if (get().jump && !spacebarDisabled) {
          setSpacebarPressed(true);
          setTimeout(() => {
            setSpacebarPressed(false);
            setSpacebarDisabled(true);
            setTimeout(() => {
              setSpacebarDisabled(false);
            }, 500);
          }, 1000);
        }

        if (spacebarPressed) {
          vel.y = 1;
          if (get().forward) {
            vel.x +=
              Math.sin(
                rotationTarget.current + characterRotationTarget.current
              ) * 0.1;
            vel.z +=
              Math.cos(
                rotationTarget.current + characterRotationTarget.current
              ) * 0.1;
          }
          setAnimation("jump");
        }

        rb.current.setLinvel(vel, true);
      }

      // CAMERA COLLISION DETECTION
      if (cameraPosition.current && cameraTarget.current) {
        cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
        cameraTarget.current.getWorldPosition(
          cameraLookAtWorldPosition.current
        );

        // Set up the raycaster
        raycaster.current.set(
          cameraLookAtWorldPosition.current,
          cameraDirection.current
        );
        cameraDirection.current
          .subVectors(
            cameraWorldPosition.current,
            cameraLookAtWorldPosition.current
          )
          .normalize();

        const intersects = raycaster.current.intersectObjects(
          scene.children,
          true
        );

        if (
          intersects.length > 0 &&
          intersects[0] &&
          intersects[0].distance <
            cameraWorldPosition.current.distanceTo(
              cameraLookAtWorldPosition.current
            )
        ) {
          if (intersects[0]) {
            const newCameraPos = cameraLookAtWorldPosition.current
              .clone()
              .add(
                cameraDirection.current.multiplyScalar(
                  intersects[0].distance - 0.1
                )
              );
            camera.position.lerp(newCameraPos, 0);
          } else {
            camera.position.lerp(cameraWorldPosition.current, 0.1);
          }
        } else {
          camera.position.lerp(cameraWorldPosition.current, 0.1);
        }

        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
        camera.lookAt(cameraLookAt.current);
      }

      if (container.current) {
        container.current.rotation.y = MathUtils.lerp(
          container.current.rotation.y,
          rotationTarget.current,
          0.1
        );
      }
    }
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1} />
        <group ref={cameraPosition} position-y={0.5} position-z={-1.5} />
        <group ref={character}>
          <Character scale={0.18} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.16]} />
    </RigidBody>
  );
};
