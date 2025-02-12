import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";

function LoadingScreen({ images }: { images: string[] }) {
  const { progress } = useProgress();
  const [index, setIndex] = useState(0);
  const imageRef = useRef(null);

  // On every index change, fade in the new image
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
      );
    }
  }, [index]);

  // Set up an interval that fades out the current image and then switches it
  useEffect(() => {
    const interval = setInterval(() => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIndex((prev) => (prev + 1) % images.length);
          },
        });
      }
    }, 2000); // Switch images every 2 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="loading-screen">
      {/* Container for the image with position relative for Next.js Image layout="fill" */}
      <div
        className="loading-image-container"
        ref={imageRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          src={images[index]!}
          alt="Loading Screen"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      <p className="loading-text">Loading... {Math.floor(progress)}%</p>
    </div>
  );
}

export default LoadingScreen;
