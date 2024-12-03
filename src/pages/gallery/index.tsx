import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { NextPage } from "next";
import Image from "next/image";
import {
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { FooterBody } from "~/components/footer";
import GallerySlide from "~/components/galleryslide";
import ProgressBar from "~/components/galleryslide/progressBar/progress-bar";
import styles from "~/components/galleryslide/styles/shadow.module.css";
import { env } from "~/env";

const Gallery: NextPage = () => {
  const [activeYear, setActiveYear] = useState<number>(0);
  const swiperRef = useRef<SwiperType>();
  const years = [2019, 2020, 2022, 2023, 2024] as const;
  const imageCounts = [29, 12, 26, 26, 0] as const;

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
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      toast.success(
        "Feel free to interact with the console, Swipe the screens etc to interact!",
        {
          duration: 3000,
          style: {
            backgroundColor: "#7628D0",
            color: "white",
          },
        },
      );
    }
  }, []);

  useLayoutEffect(() => {
    gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#animation", {
        delay: 0.3,
        filter: "drop-shadow(0px 0px 0px white)",
        y: -90,
        // boxShadow: "0px 10px 67px 40px rgba(0,0,0,0.25)",
      }).to("#animation", {
        y: 0,
        filter: "drop-shadow(0px 0px 2vw white)",
        // boxShadow: "0px 10px 67px 90px rgba(0,0,0,0.25)",
        duration: 0.5,
      });
    });
    window?.addEventListener("deviceorientation", (evt) => {
      const xAng = evt.gamma;
      if (xAng) x.set(xAng / 100);
      const yAng = evt.beta;
      if (yAng) y.set(yAng / 100);
    });
  }, [activeYear, x, y]);
  const img2019: string[] = generateImagePaths(years[0], imageCounts[0], "jpg");
  const img2020: string[] = generateImagePaths(years[1], imageCounts[1], "jpg");
  const img2022: string[] = generateImagePaths(years[2], imageCounts[2], "jpg");
  const img2023: string[] = generateImagePaths(years[3], imageCounts[3], "jpg");

  //Not needed but refactoring not worth it
  const img2024: string[] = generateImagePaths(years[4], imageCounts[4], "jpg");

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(
    mouseYSpring,
    [-1.8, 1.8],
    ["150deg", "-150deg"],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-1.8, 1.8],
    ["-150deg", "150deg"],
  );
  const tiltStars: MouseEventHandler<HTMLElement> = (e) => {
    const xPct = (e.clientX / window.innerWidth - 0.5) * 0.4;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 0.4;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <>
      <section
        className="relative flex h-screen w-full flex-col overflow-hidden bg-[url('/assets/png/galleryBg.png')] bg-cover bg-center"
        onMouseMove={tiltStars}
      >
        <motion.div
          className={
            "absolute h-full w-full bg-[url('/assets/png/galleryBgStars.png')] bg-cover bg-center"
          }
          id="stars"
          style={{ rotateY, rotateX }}
        ></motion.div>
        {/* Pc Section */}
        <div className="z-0 min-h-screen overflow-y-auto">
          {years.map((year, index) => {
            if (index === 4) return;
            return (
              <h1
                key={year}
                id="animation"
                className={
                  styles["text-shadow"] +
                  ` absolute top-28 z-50 w-full border-black text-center text-4xl font-extrabold text-white sm:text-6xl ${
                    activeYear === index ? "block" : "hidden"
                  }`
                }
              >
                INCRIDEA <span className="tracking-tight">{year}</span>
              </h1>
            );
          })}

          {/* Slide Section */}
          <Swiper
            autoplay={false}
            onBeforeInit={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            speed={900}
            spaceBetween={200}
            noSwiping={true}
            allowTouchMove={false}
            className="relative flex h-full sm:w-full"
          >
            <SwiperSlide className="flex items-center justify-center text-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <GallerySlide title={2019} imgArr={img2019} emulator="gba" />
              </div>
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-center text-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <GallerySlide
                  title={2020}
                  imgArr={img2020}
                  emulator="retroPC"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-center text-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <GallerySlide
                  title={2022}
                  imgArr={img2022}
                  emulator="retroTV"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-center text-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <GallerySlide
                  title={2023}
                  imgArr={img2023}
                  emulator="console"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-center text-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <GallerySlide title={2024} imgArr={img2024} emulator="final" />
              </div>
            </SwiperSlide>
            <div className="absolute bottom-32 z-20 mx-auto flex w-full justify-between gap-4 px-20 sm:bottom-[16%]">
              <button
                id="float"
                onClick={async () => {
                  if (activeYear !== 0) {
                    await gsap.to("#animation", {
                      y: -90,
                      // boxShadow: "0px 10px 67px 20px rgba(0,0,0,0.25)",
                      filter: "drop-shadow(0px 0px 0px white)",
                      duration: 0.2,
                    });
                  }

                  setActiveYear((cur) => {
                    if (cur === 0) return cur;
                    return --cur;
                  });
                  return swiperRef.current?.slidePrev();
                }}
                className={`z-20 h-6 w-auto transition-all duration-75 ease-in-out`}
              >
                <Image
                  src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/8bitArrow.svg`}
                  alt="arrow-previous"
                  width={50}
                  height={50}
                  className="z-20 h-12 w-12 rotate-180 md:h-20 md:w-20"
                  style={{
                    filter:
                      "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)",
                    WebkitFilter:
                      "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)",
                  }}
                ></Image>
              </button>
              <button
                id="float"
                onClick={async () => {
                  if (activeYear < years.length) {
                    await gsap.to("#animation", {
                      y: -90,
                      // boxShadow: "0px 10px 67px 20px rgba(0,0,0,0.25)",
                      filter: "drop-shadow(0px 0px 0px white)",
                      duration: 0.2,
                    });
                  }

                  setActiveYear((cur) => {
                    if (cur === years.length) return cur;
                    return ++cur;
                  });
                  return swiperRef.current?.slideNext();
                }}
                className="z-[500] h-6 w-auto transition-all duration-75 ease-in-out"
              >
                <Image
                  src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/8bitArrow.svg`}
                  alt="arrow-next"
                  width={50}
                  height={50}
                  //  -webkit-filter: drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black);filter: drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black);
                  className="z-[500] h-12 w-12 md:h-20 md:w-20"
                  style={{
                    filter:
                      "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)",
                    WebkitFilter:
                      "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)",
                  }}
                ></Image>
              </button>
            </div>
          </Swiper>
        </div>
      </section>
      <ProgressBar year={activeYear}></ProgressBar>
      <FooterBody />
    </>
  );
};

export default Gallery;
