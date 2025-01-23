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

  const years = [2021, 2022, 2023, 2024] as const;
  const imageCounts = [29, 12, 26, 26] as const;

  const handleClockClick = (angle: number) => {
    switch (angle) {
      case 0:
      case 2 * Math.PI:
        setActiveYear(2);
        break;
      case Math.PI / 2:
        setActiveYear(3);
        break;
      case (3 * Math.PI) / 2:
      case -Math.PI / 2:
        setActiveYear(1);
        break;
      case Math.PI:
        setActiveYear(0);
        break;
    }
  };

  const generateImagePaths = (
    year: number,
    count: number,
    extension: string,
  ) => {
    const imagePaths = [];
    for (let i = 1; i <= count; i++) {
      imagePaths.push(`gallery/${year}/${i}.${extension}`);
    }
    return imagePaths;
  };

  const img2021: string[] = generateImagePaths(years[0], imageCounts[0], "jpg");
  const img2022: string[] = generateImagePaths(years[1], imageCounts[1], "jpg");
  const img2023: string[] = generateImagePaths(years[2], imageCounts[2], "jpg");
  const img2024: string[] = generateImagePaths(years[3], imageCounts[3], "jpg");

  // const images22: string[] = [
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD64Sgn2E7gjUQEnHRB6acYe3z07wmr1FZphyNP',
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD6dNwH6gQNk6Mso8WuK2jgRcmrVZdx5zTyB4lS',
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD6R0y97VshMbdqu9Dv5sClAGzH4NFEa8xgrwZW',
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD6oXcQEjTAjvGsfIbWS4wiz2DCtNxYrhE6q3UR',
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD63kfzz9uyGThZ7z4KLvCYJEoXsRPUlefFnuwk',
  //   'https://cxyw63cg3t.ufs.sh/f/rcOPZjbdsKD656UKEcozf8HJFAlsQ20KwyZNUIoLmOVecu4g'
  // ]

  const renderActiveYearComponent = () => {
    switch (activeYear) {
      case 0:
        return <Inc21 />;
      case 1:
        return <Inc22 imgArr={img2022} />;
      case 2:
        return <Inc23 imageUrls={img2023} />;
      case 3:
        return <Inc24 />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className="relative flex h-screen w-full flex-col overflow-hidden ">
        {/* Timeline with Dots */}
        <div className="absolute top-32 left-0 right-0 flex items-center justify-between px-4 md:px-12 lg:px-20">
          <Clock onClockClick={handleClockClick} />
        </div>

        {/* Render Active Year Component */}
        <div className="relative mt-16">{renderActiveYearComponent()}</div>
      </section>
      {/* Footer */}
      <FooterBody />
    </>
  );
};

export default Gallery;
