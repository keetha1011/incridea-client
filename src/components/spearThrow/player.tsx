import React, { useContext, useEffect, useRef, useState } from "react";
import { GameContext, useAnimation } from "./gameContext";

const playerThrowFrames = [
  "/2025/explore/throwspear/player/throw1.png",
  "/2025/explore/throwspear/player/throw2.png",
  "/2025/explore/throwspear/player/throw3.png",
];

const spear = "/2025/explore/throwspear/spear.png";

export default function Player() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spearCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpearAnimating, setIsSpearAnimating] = useState(false);
  const [isPlayerAnimating, setIsPlayerAnimating] = useState(false);
  const gameContext = useContext(GameContext);
  const animation = useRef(0);

  const [animationGameState, setAnimationGameState] = useState(gameContext);
  useAnimation((value) => {
    setAnimationGameState(value);
  });

  let spearImage: HTMLImageElement;
  if (typeof window !== "undefined") {
    spearImage = new Image();
    spearImage.src = spear;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Set canvas resolution
    const scale = window.devicePixelRatio;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    context.scale(scale, scale);

    let frameIndex = 0;
    const playerSize = Math.max(window.innerWidth, window.innerHeight) / 6; // Scale player size with screen size
    const players = Array.from({ length: 1 }, () => ({
      x: 10,
      y: canvas.height / scale - playerSize - 10, // Place player at the bottom
      direction: 0, // Make the player position fixed
    }));

    let playerImages: HTMLImageElement[] = [];
    if (typeof window !== "undefined") {
      playerImages = playerThrowFrames.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      players.forEach((player) => {
        const img = playerImages[frameIndex];

        let aspectRatio = 1;
        if (img) {
          aspectRatio = img.width / img.height;
        }
        const width = playerSize * aspectRatio;
        const height = playerSize;
        if (img) {
          context.drawImage(img, player.x * 4, player.y, width, height);
        }
        if (!gameContext.paused.current) {
          if (gameContext.creatureAttack.current) {
            frameIndex = 0;
          } else if (isDragging) {
            frameIndex = (frameIndex + 1) % playerThrowFrames.length;
          } else {
            frameIndex = 0; // Reset to the first frame when not dragging
          }
        }
      });
      if (isDragging) {
        setTimeout(() => {
          if (frameIndex === 0) {
            setIsDragging(false); // Stop animation after one cycle
            setIsPlayerAnimating(false); // Player animation complete
          } else {
            animation.current = requestAnimationFrame(animate);
          }
        }, 500 / playerThrowFrames.length); // Complete animation in 0.5 seconds
      }
    };

    if (playerImages[0]) {
      playerImages[0].onload = () => {
        animate();
      };
    }

    return () => {
      cancelAnimationFrame(animation.current);
    };
  }, [isDragging, animationGameState.paused.current]);

  const throwSpear = (angle: number) => {
    if (gameContext.paused.current || isSpearAnimating) return;
    setIsSpearAnimating(true);
    const spearCanvas = spearCanvasRef.current;
    const context = spearCanvas?.getContext("2d");
    const playerSize = Math.max(window.innerWidth, window.innerHeight) / 6;
    if (!spearCanvas || !context) return;

    const scale = window.devicePixelRatio;
    spearCanvas.width = window.innerWidth * scale;
    spearCanvas.height = window.innerHeight * scale;
    context.scale(scale, scale);

    const startX = 50;
    const startY = spearCanvas.height / scale - playerSize - 10;
    const isMobile = window.innerHeight < 768;
    const velocity = isMobile
      ? Math.sqrt(spearCanvas.width * 0.33 * 9.8) // Adjust velocity for mobile
      : Math.sqrt(spearCanvas.width * 0.8 * 9.8); // Adjust velocity for desktop
    const gravity = 9.8; // Standard gravity

    let time = 0;
    const interval = isMobile ? 30 : 60; // Adjust interval for mobile and desktop (animation speed)

    const spearWidth = Math.max(window.innerWidth, window.innerHeight) / 10;
    const spearHeight = spearWidth / 2;

    const animateSpear = () => {
      context.clearRect(0, 0, spearCanvas.width, spearCanvas.height);

      const radians = (angle * Math.PI) / 180;
      const x = startX + velocity * time * Math.cos(radians);
      const y =
        startY -
        (velocity * time * Math.sin(radians) - 0.5 * gravity * time * time);

      if (x < spearCanvas.width && y < spearCanvas.height) {
        context.drawImage(spearImage, x, y, spearWidth, spearHeight); // Adjust spear size based on screen size
        gameContext.updateSpear(x, y);
        time += interval / 200;

        // console.log(gameContext.spearPos.current.x / window.devicePixelRatio, gameContext.creaturePos.current);
        isHit(
          gameContext.spearPos.current,
          gameContext.creaturePos.current,
          window.devicePixelRatio,
        );

        requestAnimationFrame(animateSpear);
      } else {
        setIsSpearAnimating(false); // Animation complete
      }
    };

    setTimeout(animateSpear, 500); // Delay spear throw until player animation is complete
  };

  function isHit(
    spear: { x: number; y: number },
    creature: { x: number; y: number },
    ratio: number,
  ) {
    const range = 40;
    const isMobile = window.innerHeight < 768;
    if (!isMobile) {
      const offset = 50;
      if (
        !gameContext.creatureAttack.current &&
        Math.abs(spear.x / ratio - creature.x - offset) <= range &&
        Math.abs(spear.y / ratio - 30 - creature.y) <= range
      ) {
        gameContext.updateCreatureHit(true);
      }
    } else {
      const offset = 30;
      if (
        !gameContext.creatureAttack.current &&
        Math.abs(spear.x - creature.x - offset) <= range &&
        Math.abs(spear.y - 40 - creature.y) <= range - 20
      ) {
        gameContext.updateCreatureHit(true);
      }
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute w-screen h-screen z-30"
        onMouseDownCapture={(e) => {
          if (isPlayerAnimating || isSpearAnimating) return;
          setIsPlayerAnimating(true);
          setIsDragging(true);
          const canvas = canvasRef.current;
          if (canvas) {
            const playerSize =
              Math.max(window.innerWidth, window.innerHeight) / 6;
            const scale = window.devicePixelRatio;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const playerCenterX = 10 * 4 + playerSize / 2; // Center X position of the player
            const playerCenterY = canvas.height / scale - playerSize / 2 - 10; // Center Y position of the player

            const angle =
              Math.atan2(playerCenterY - y, x - playerCenterX) *
              (180 / Math.PI);
            gameContext.updateAngle(angle);
            setTimeout(() => {
              if (!gameContext.creatureAttack.current) {
                throwSpear(angle);
              }
            }, 0); // Call throwSpear with the calculated angle after delay
          }
        }}
      />
      <canvas
        ref={spearCanvasRef}
        className="absolute w-screen h-screen z-20"
      />
    </>
  );
}
