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
          <div className="flex items-center gap-4 md:gap-8">
            <div className="h-1 w-16 sm:w-20 md:w-28 lg:w-40"></div>
            {/* Only two dots for left side (Incridea 21 and 22) */}
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${activeYear === 0 ? "bg-green-500 border-green-700 glow-green" : "bg-gray-200 border-gray-400"}`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${activeYear === 1 ? "bg-green-500 border-green-700 glow-green" : "bg-gray-200 border-gray-400"}`}
              ></div>
            </div>
          </div>

          {/* Clock */}
          <div className="relative transform translate-y-10 md:-translate-y-10">
            <Clock onClockClick={handleClockClick} />
          </div>

          {/* Right Line and Dots */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${activeYear === 2 ? "bg-green-500 border-green-700 glow-green" : "bg-gray-200 border-gray-400"}`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full border-2 transition-all duration-300 ${activeYear === 3 ? "bg-green-500 border-green-700 glow-green" : "bg-gray-200 border-gray-400"}`}
              ></div>
            </div>
            <div className="h-1 w-16 sm:w-20 md:w-28 lg:w-40"></div>
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
