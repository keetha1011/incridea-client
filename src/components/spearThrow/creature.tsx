import React, { useRef, useEffect, useContext } from "react";
import { GameContext } from "./gameContext";

interface Creature {
  x: number;
  y: number;
  direction: number;
}

const attackFrames = [
  "/2025/explore/throwspear/creature/attack/attack000.png",
  "/2025/explore/throwspear/creature/attack/attack001.png",
  "/2025/explore/throwspear/creature/attack/attack002.png",
  "/2025/explore/throwspear/creature/attack/attack003.png",
  "/2025/explore/throwspear/creature/attack/attack004.png",
  "/2025/explore/throwspear/creature/attack/attack005.png",
];

const confuseFrames = [
  "/2025/explore/throwspear/creature/confuse/confuse000.png",
  "/2025/explore/throwspear/creature/confuse/confuse001.png",
  "/2025/explore/throwspear/creature/confuse/confuse002.png",
];

// const deathFrames = [
//   "/2025/explore/throwspear/creature/death/death000.png",
//   "/2025/explore/throwspear/creature/death/death001.png",
//   "/2025/explore/throwspear/creature/death/death002.png",
//   "/2025/explore/throwspear/creature/death/death003.png",
//   "/2025/explore/throwspear/creature/death/death004.png",
//   "/2025/explore/throwspear/creature/death/death005.png",
// ];

const walkFrames = [
  "/2025/explore/throwspear/creature/walk/walk000.png",
  "/2025/explore/throwspear/creature/walk/walk001.png",
  "/2025/explore/throwspear/creature/walk/walk002.png",
  "/2025/explore/throwspear/creature/walk/walk003.png",
  "/2025/explore/throwspear/creature/walk/walk004.png",
  "/2025/explore/throwspear/creature/walk/walk005.png",
];

export default function Creature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContext = useContext(GameContext);

  const frameIndex = useRef(0);
  const lastDirectionChange = useRef(Date.now());
  const lastAttack = useRef(Date.now());
  const creaturePosition = useRef({ x: 0, y: 0 });

  const isWalking = useRef(true);
  const isMovingToAttack = useRef(false);
  const isAttacking = useRef(false);
  const isMovingToPosition = useRef(false);

  // const [animationGameState, setAnimationGameState] = useState(gameContext);
  // useAnimation((value) => {
  //   setAnimationGameState(value);
  // });

  const animation = useRef(0);

  let creatureImages: HTMLImageElement[] = [];
  let attackImages: HTMLImageElement[] = [];
  let confuseImages: HTMLImageElement[] = [];

  if (typeof window !== "undefined") {
    creatureImages = walkFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    attackImages = attackFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    confuseImages = confuseFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const scale = window.devicePixelRatio;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    context.scale(scale, scale);

    const spriteSize = Math.min(window.innerWidth, window.innerHeight) / 4;
    const creature = {
      x: canvas.width / scale - spriteSize - 10,
      y: canvas.height / scale - spriteSize - 10,
      direction: -1,
    };

    let confuseCount = 0;

    const animate = () => {
      let img = null;

      if (gameContext.creatureHit.current) {
        img = confuseImages[frameIndex.current < 0 ? 0 : frameIndex.current];
      } else if (
        isWalking.current ||
        isMovingToAttack.current ||
        isMovingToPosition.current
      ) {
        img = creatureImages[frameIndex.current < 0 ? 0 : frameIndex.current];
      } else if (isAttacking.current) {
        img = attackImages[frameIndex.current < 0 ? 0 : frameIndex.current];
      }

      if (img === null || img === undefined) {
        img = creatureImages[0];
      }

      let aspectRatio = 1;
      if (img) {
        aspectRatio = img.width / img.height;
      }
      const width = spriteSize * aspectRatio;
      const height = spriteSize;

      context.clearRect(0, 0, canvas.width, canvas.height);
      if (img) {
        context.drawImage(img, creature.x, creature.y, width, height);
      }
      // if (gameContext.paused.current) return;
      if (!gameContext.paused.current) {
        if (gameContext.creatureHit.current) {
          confuse();

          if (
            frameIndex.current === confuseFrames.length - 1 &&
            confuseCount > 3
          ) {
            gameContext.updateCreatureHit(false);
            confuseCount = 0;
            gameContext.updateCreatureHitCount(
              gameContext.creatureHitCount.current + 1,
            );
            frameIndex.current = 0;
            if (gameContext.creatureHitCount.current >= 5) {
              gameContext.gameWin();
            }
          } else {
            confuseCount++;
          }
        } else if (isWalking.current) {
          walk(creature, canvas, scale, spriteSize);
          gameContext.updateCreature(creature.x, creature.y);

          if (Date.now() - lastAttack.current > 10000) {
            isWalking.current = false;
            isMovingToAttack.current = true;
            gameContext.updateCreatureAttack(true);
          }
        } else if (isMovingToAttack.current) {
          moveToAttack(creature);

          if (creature.x <= 100) {
            isMovingToAttack.current = false;
            isAttacking.current = true;
          }
        } else if (isAttacking.current) {
          attack();

          if (frameIndex.current === attackFrames.length - 1) {
            isAttacking.current = false;
            isMovingToPosition.current = true;
            gameContext.updateLives(); // Update lives when the creature hits the sprite
            if (gameContext.lives.current <= 0) {
              // gameContext.updatePaused();
              gameContext.gameLose();
            }
          }
        } else if (isMovingToPosition.current) {
          creature.x += 50;
          frameIndex.current =
            frameIndex.current + 1 >= walkFrames.length
              ? 0
              : frameIndex.current + 1;

          if (creature.x >= creaturePosition.current.x) {
            isMovingToPosition.current = false;
            isWalking.current = true;
            lastAttack.current = Date.now();
            gameContext.updateCreatureAttack(false);
          }
        }
      }

      if (
        isWalking.current ||
        isAttacking.current ||
        isMovingToAttack.current ||
        isMovingToPosition.current
      ) {
        setTimeout(() => {
          animation.current = requestAnimationFrame(animate);
        }, 100);
      }
    };

    const walk = (
      creature: Creature,
      canvas: HTMLCanvasElement,
      scale: number,
      spriteSize: number,
    ) => {
      creature.x += creature.direction * 10;

      if (
        creature.x >= canvas.width / scale - spriteSize - 10 ||
        creature.x <= canvas.width / scale / 4 ||
        (Date.now() - lastDirectionChange.current > 3000 && Math.random() < 0.1)
      ) {
        creature.direction *= -1;
        lastDirectionChange.current = Date.now();
      }
      creaturePosition.current = { x: creature.x, y: creature.y };
      gameContext.updateCreature(creature.x, creature.y);
      if (creature.direction < 0) {
        frameIndex.current =
          frameIndex.current + 1 >= walkFrames.length
            ? 0
            : frameIndex.current + 1;
      } else {
        frameIndex.current =
          frameIndex.current - 1 < 0
            ? walkFrames.length - 1
            : frameIndex.current - 1;
      }
    };

    const moveToAttack = (creature: Creature) => {
      creature.x -= 50;
      frameIndex.current =
        frameIndex.current + 1 >= walkFrames.length
          ? 0
          : frameIndex.current + 1;
    };

    const attack = () => {
      flickerRed();
      frameIndex.current =
        frameIndex.current + 1 >= attackFrames.length
          ? 0
          : frameIndex.current + 1;
    };

    const confuse = () => {
      frameIndex.current =
        frameIndex.current + 1 >= confuseFrames.length
          ? 0
          : frameIndex.current + 1;
    };

    const flickerRed = () => {
      const flickerDuration = 100; // Duration of the flicker in milliseconds
      const flickerInterval = 50; // Interval between flickers in milliseconds
      let flickerCount = 0;

      const flicker = () => {
        if (flickerCount < 3) {
          const canvas = canvasRef.current;
          const context = canvas?.getContext("2d");
          if (!canvas || !context) return;

          context.fillStyle = "rgba(255, 0, 0, 0.5)";
          context.fillRect(0, 0, canvas.width, canvas.height);
          setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            flickerCount++;
            setTimeout(flicker, flickerInterval);
          }, flickerDuration);
        }
      };

      flicker();
    };

    // creatureImages[0].onload = () => {
    //   animation.current = requestAnimationFrame(animate)
    // };

    animation.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute w-screen h-screen top-0 left-0 z-20"
    />
  );
}
