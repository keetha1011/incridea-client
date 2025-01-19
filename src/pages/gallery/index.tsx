import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { type NextPage } from "next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { type Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Clock from "~/components/galleryslide/clock";
import { FooterBody } from "~/components/footer";
import ProgressBar from "~/components/galleryslide/progressBar/progress-bar";
import Inc21 from "~/components/galleryslide/scenes/Inc21";
import Inc22 from "~/components/galleryslide/scenes/Inc22";
import Inc23 from "~/components/galleryslide/scenes/Inc23";
import Inc24 from "~/components/galleryslide/scenes/Inc24";

const Gallery: NextPage = () => {
  const [activeYear, setActiveYear] = useState<number>(0);
  const [glowClock, setGlowClock] = useState<boolean>(false);
  //const swiperRef = useRef<SwiperType>();
  const incrideaYears = [
    "Incridea 21",
    "Incridea 22",
    "Incridea 23",
    "Incridea 24",
  ];

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     toast.success(
  //       "Feel free to interact with the console, Swipe the screens etc to interact!",
  //       {
  //         duration: 3000,
  //         style: {
  //           backgroundColor: "#7628D0",
  //           color: "white",
  //         },
  //       }
  //     );
  //   }
  // }, []);

  const handleClockClick = () => {
    setActiveYear((prev) => {
      const newYear = (prev + 1) % 4; // Cycle through 0 to 3
      if (newYear === 0 && prev === 3) {
        setGlowClock(true); // Glow clock when clicking 4th time
      } else {
        setGlowClock(false);
      }
      return newYear;
    });
  };

  const renderActiveYearComponent = () => {
    switch (activeYear) {
      case 0:
        return <Inc21 />;
      case 1:
        return <Inc22 />;
      case 2:
        return <Inc23 />;
      case 3:
        return <Inc24 />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
        {/* Timeline with Dots */}
        <div className="absolute top-32 left-0 right-0 flex items-center justify-between px-4 md:px-12 lg:px-20">
          {/* Left Line and Dots */}
          <div className="flex items-center gap-2">
            <div className="h-1 w-16 bg-gray-400 md:w-28 lg:w-40"></div>
            {incrideaYears.map((_, index) => (
              <div
                key={`left-dot-${index}`}
                className={`h-4 w-4 rounded-full border-2 ${
                  activeYear === index
                    ? "bg-blue-500 border-blue-700"
                    : "bg-gray-200 border-gray-400"
                }`}
              ></div>
            ))}
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                activeYear === 0
                  ? "bg-blue-500 border-blue-700"
                  : "bg-gray-200 border-gray-400"
              }`}
            ></div>
          </div>

          {/* Clock */}
          <div
            className={`relative z-50 transform -translate-y-10 ${
              glowClock ? "animate-pulse" : ""
            }`}
          >
            <Clock onClockClick={handleClockClick} />
          </div>

          {/* Right Line and Dots */}
          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                activeYear === 0
                  ? "bg-blue-500 border-blue-700"
                  : "bg-gray-200 border-gray-400"
              }`}
            ></div>
            {incrideaYears.map((_, index) => (
              <div
                key={`right-dot-${index}`}
                className={`h-4 w-4 rounded-full border-2 ${
                  activeYear === index
                    ? "bg-blue-500 border-blue-700"
                    : "bg-gray-200 border-gray-400"
                }`}
              ></div>
            ))}
            <div className="h-1 w-16 bg-gray-400 md:w-28 lg:w-40"></div>
          </div>
        </div>

        {/* Render Active Year Component */}
        <div className="relative z-40 mt-20">{renderActiveYearComponent()}</div>
      </section>

      {/* Footer */}
      <FooterBody />
    </>
  );
};

export default Gallery;
