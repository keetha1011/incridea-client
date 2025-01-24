import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import XRayComponent from "../xray";
import Parallax from "parallax-js";

gsap.registerPlugin(Draggable);

export default function Inc23({ imgArr }: { imgArr: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const beltRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (beltRef.current) {
      const belt = beltRef.current;

      // Make the belt draggable
      Draggable.create(belt, {
        type: "x",
        inertia: true,
        bounds: { minX: -belt.scrollWidth / 2, maxX: 0 },
        onDragStart: () => {
          gsap.set(belt, { zIndex: 5 }); // Ensure the belt stays below the XRayComponent
        },
        onDragEnd: () => {
          gsap.set(belt, { zIndex: 1 });
        },
      });

      // Calculate the full width of the belt
      const beltWidth = belt.scrollWidth;

      // Create GSAP animation
      animationRef.current = gsap.to(belt, {
        x: `-=${beltWidth / 2}`, // Move by half the belt width
        duration: 180, // Adjust the speed if needed
        repeat: -1, // Infinite scrolling
        ease: "linear",
        modifiers: {
          x: (x: string) => {
            return `${parseFloat(x) % beltWidth}px`; // Reset position seamlessly
          },
        },
      });

      // Cleanup GSAP instance on component unmount
      return () => {
        animationRef.current?.kill();
      };
    }
  }, []);

  // Toggle pause/resume when `isPaused` changes
  useEffect(() => {
    if (animationRef.current) {
      if (isPaused) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    }
  }, [isPaused]);

  // Add parallax effect to the background
  useEffect(() => {
    if (backgroundRef.current) {
      const parallaxInstance = new Parallax(backgroundRef.current, {
        relativeInput: true,
        hoverOnly: true,
      });

      return () => {
        parallaxInstance.destroy();
      };
    }
  }, []);

  return (
    <div className="relative top-96 overflow-hidden px-8">
      {/* Parallax Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/landing/lounge@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="flex flex-col items-center space-y-6 pb-10 relative z-10">
        <div className="h-72 relative w-full overflow-hidden flex items-center">
          {/* XRay Component */}
          <div className="w-52 h-96 rounded-lg mr-4 absolute left-0 z-30">
            <XRayComponent isPaused={isPaused} setIsPaused={setIsPaused} />
          </div>

          {/* Conveyor Belt */}
          <div
            className="relative h-44 min-w-[600%] bg-gray-800 border-4 z-10 border-gray-500 flex items-center overflow-hidden cursor-grab active:cursor-grabbing conveyor mx-8"
            ref={beltRef}
            style={{ zIndex: 1 }} // Ensure belt stays below XRayComponent
          >
            {/* Conveyor Lines */}
            <div className="absolute inset-0 flex justify-between px-2">
              {Array.from({ length: 100 }).map((_, index) => (
                <div
                  key={index}
                  className="h-full w-1 bg-white opacity-50"
                ></div>
              ))}
            </div>
            <div className="flex space-x-16 p-8 relative z-10">
              {[...imgArr, ...imgArr].map((src, index) => (
                <div
                  key={index}
                  className={`w-48 h-48 flex-shrink-0 relative flex justify-center items-center ${
                    index === 0 ? "ml-72" : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Gallery Image ${index + 1}`}
                    width={512}
                    height={512}
                    className="rounded-lg object-cover shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(src)}
                    style={{ backgroundColor: "white" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Selected"
              width={500}
              height={300}
              className="rounded-md"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
