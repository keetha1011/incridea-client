import gsap from "gsap";
import Image from "next/image";
import React, { useLayoutEffect, useRef, useState } from "react";
import { type Swiper as SwiperType } from "swiper";
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BlurImage from "~/components/blurImage";
import Modal from "~/components/galleryslide/gallery-modal";
import PreviewComponent from "~/components/galleryslide/previewComponent/preview-component";
import styles from "~/components/galleryslide/styles/shadow.module.css";
import { env } from "~/env";

import ToolTip from "./tool-tip";

const GbaComponent = ({ imgArr }: { imgArr: string[] }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const thumbnailSrc = "/thumbnails/incridea19.jpg";

  const [isAnimatingRight, setAnimatingRight] = useState(false);
  const [isAnimatingLeft, setAnimatingLeft] = useState(false);
  const handleButtonClickPrev = () => {
    setAnimatingLeft(true);
    swiperRef.current?.slidePrev();
    setTimeout(() => {
      setAnimatingLeft(false);
    }, 400);
  };
  const handleButtonClickNext = () => {
    setAnimatingRight(true);
    swiperRef.current?.slideNext();
    setTimeout(() => {
      setAnimatingRight(false);
    }, 400);
  };

  const [portraitImages, setPortraitImages] = useState<{
    [key: number]: boolean;
  }>({});

  const handleImageLoad = (
    index: number,
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const isPortrait = naturalHeight > naturalWidth;

    setPortraitImages((prev) => ({
      ...prev,
      [index]: isPortrait,
    }));
  };

  const swiperRef = useRef<SwiperType>();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#animation", {
        y: -90,
        filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.45))",
      }).to("#animation", {
        y: 0,
        filter: "drop-shadow(0px 0px 2vw white)",
        duration: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative flex flex-col gap-y-0">
      {" "}
      {/* <h1
      id="animation"
        className={
          styles["text-shadow"] +
          ` font-extrabold sm:text-6xl text-4xl z-50 border-black text-white`
        }
      >
        INCRIDEA <span className="tracking-tight">19</span>
      </h1> */}
      <div
        id="animation"
        className="relative mx-auto flex h-[119vw] w-[85vw] items-center justify-center rounded-[85px] sm:top-16 sm:h-[30vw] sm:w-[63.5vw]"
      >
        <Image
          fill
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/gba-vertical.svg`}
          alt="incridea"
          className="scale-110 object-center sm:hidden"
          priority
        />
        <Image
          fill
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/gba-horizontal.svg`}
          alt="incridea"
          className="hidden scale-[120%] sm:block"
          priority
        />

        <div className="absolute top-[19vw] z-10 h-[23.6vw] w-[50vw] scale-[105%] sm:right-[-.35vw] sm:top-[5.5vw] sm:h-[31vw] sm:w-[64vw]">
          <Swiper
            onBeforeInit={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            mousewheel={true}
            modules={[Navigation, Autoplay, Mousewheel]}
            autoplay={{ delay: 5000 }}
            speed={500}
            className="relative -top-[7vw] left-[-4vw] h-[54vw] w-[58vw] sm:-top-[.9vw] sm:left-[0] sm:z-50 sm:h-[18vw] sm:w-[35.7vw] sm:scale-125 sm:border-none"
          >
            {imgArr.map((img, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="flex cursor-pointer items-center justify-center bg-white text-center"
                  onClick={() => {
                    setActiveModal(true);
                    setActiveIndex(index);
                  }}
                >
                  {index === 0 && (
                    <ToolTip
                      classValue="top-[0] text-center bg-black/60 sm:right-[12vw] right-0 text-xs border sm:text-lg"
                      text="click to preview image"
                    ></ToolTip>
                  )}

                  <div className="relative flex h-full w-full items-center justify-center">
                    <BlurImage
                      fill
                      alt="Blurred Image"
                      src={env.NEXT_PUBLIC_BASE_IMAGE_URL + img}
                      className="object-cover blur-xl"
                    />
                    <Image
                      fill
                      src={env.NEXT_PUBLIC_BASE_IMAGE_URL + img}
                      alt="incridea"
                      className={`z-10 object-cover ${
                        portraitImages[index] ? "object-scale-down" : ""
                      }`}
                      priority
                      onLoad={(e) => handleImageLoad(index, e)}
                    />
                  </div>
                </SwiperSlide>
              );
            })}

            <SwiperSlide
              className="flex cursor-pointer items-center justify-center bg-white text-center"
              onClick={() => {
                setActiveIndex(imgArr.length);
                setActiveModal(true);
              }}
            >
              {/* <ToolTip
                classValue="top-[0] text-center bg-black/60 sm:right-[12vw] right-0 text-xs border sm:text-lg"
                text="click to watch aftermovie"
              ></ToolTip> */}
              <div className="relative flex h-full w-full items-center justify-center">
                <BlurImage
                  fill
                  alt="Blurred Image"
                  src={thumbnailSrc}
                  className="object-fill blur-xl"
                />
                <Image
                  fill
                  src={thumbnailSrc}
                  alt="incridea"
                  className={`z-10 object-cover`}
                  priority
                />
              </div>
              <button
                onClick={() => {
                  setActiveIndex(imgArr.length);
                  setActiveModal(true);
                }}
                className={
                  styles["text-shadow"] +
                  ` absolute left-0 top-0 z-50 h-full w-full bg-transparent p-2 text-center text-base text-white md:text-lg md:font-extrabold`
                }
              >
                Click to Watch After Movie
              </button>
            </SwiperSlide>
          </Swiper>

          <button
            onClick={handleButtonClickPrev}
            className={`absolute left-[-9.6vw] top-[67vw] h-[6vw] w-[8vw] rounded-lg border-gray-100 transition-all duration-300 ease-in-out sm:-left-[1.4vw] sm:-top-[2.2vw] sm:h-[9vw] sm:w-[9vw] sm:rounded-full ${
              isAnimatingLeft ? "animate-ping border-2 sm:border-8" : ""
            }`}
          >
            <ToolTip
              classValue="top-[5vw] sm:left-20 right-0 text-xs border sm:text-lg bg-black/60"
              text="prev image"
            ></ToolTip>
          </button>
          <button
            onClick={handleButtonClickNext}
            className={`absolute left-[2vw] top-[67vw] h-[6vw] w-[8vw] rounded-lg border-gray-100 transition-all duration-300 ease-in-out sm:-top-[2.2vw] sm:left-[56vw] sm:h-[9vw] sm:w-[9vw] sm:rounded-full ${
              isAnimatingRight ? "animate-ping border-2 sm:border-8" : ""
            }`}
          >
            <ToolTip
              classValue="top-[5vw] sm:right-[1vw] right-[-10vw] bg-black/60 text-xs border sm:text-lg"
              text="next image"
            ></ToolTip>
          </button>
        </div>

        <Modal
          showModal={activeModal}
          title="test"
          onClose={() => setActiveModal(false)}
        >
          <PreviewComponent
            imgArr={imgArr}
            index={activeIndex}
            afterMovieLink="gmF72fu1w6A"
            thumbnailSrc={thumbnailSrc}
          />
        </Modal>
      </div>
    </div>
  );
};

export default GbaComponent;
