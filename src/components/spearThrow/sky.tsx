"use client";
import React, { useEffect, useRef } from "react";

const birdFrames = [
  "/2025/explore/throwspear/bird/bird_fly_1.png",
  "/2025/explore/throwspear/bird/bird_fly_2.png",
  "/2025/explore/throwspear/bird/bird_fly_3.png",
  "/2025/explore/throwspear/bird/bird_fly_4.png",
];

export default function Sky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animation = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Set canvas resolution for sharper rendering on high DPI screens
    const scale = window.devicePixelRatio;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    context.scale(scale, scale);

    let frameIndex = 0;
    const birdSize = Math.min(window.innerWidth, window.innerHeight) / 15;
    const birds = Array.from({ length: 10 }, (_, i) => ({
      x: i * 50, // Initial horizontal spacing between birds
      y: Math.random() * (canvas.height / 1.75 / scale), // Random vertical position
      direction: 1, // Birds move from left to right
      speed: 4 + Math.random(), // Add some variation in speed
    }));
    const birdImages = birdFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const animate = () => {
      if (!context || !canvas) return; // Ensure context and canvas are still valid

      setTimeout(() => {
        animation.current = requestAnimationFrame(animate);
      }, 100);

      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing each frame

      birds.forEach((bird) => {
        const birdImage = birdImages[frameIndex];
        if (birdImage) {
          context.drawImage(birdImage, bird.x * 4, bird.y, birdSize, birdSize); // Draw bird image
        }
        bird.x += bird.speed * bird.direction; // Move bird horizontally based on its speed

        // Make birds move infinitely from left to right
        if (bird.x > canvas.width / scale) {
          bird.x = -birdSize; // Reset bird position to the left side of the canvas
        }
      });

      frameIndex = (frameIndex + 1) % birdFrames.length; // Cycle through bird animation frames
    };

    birdImages[0].onload = () => {
      animate(); // Start the animation loop once the first bird image is loaded
    };

    return () => {
      cancelAnimationFrame(animation.current); // Stop the animation loop when the component unmounts
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute w-screen h-screen z-10" />;
}
