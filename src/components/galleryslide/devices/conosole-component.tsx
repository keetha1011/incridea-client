import Image from "next/image";
import React, { useRef, useState } from "react";
import { type Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BlurImage from "~/components/blurImage";
import Modal from "~/components/galleryslide/gallery-modal";
import PreviewComponent from "~/components/galleryslide/previewComponent/preview-component";
import styles from "~/components/galleryslide/styles/shadow.module.css";
import { env } from "~/env";

import ToolTip from "./tool-tip";

const Console = ({ imgArr }: { imgArr: string[] }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailSrc = "/thumbnails/incridea23.jpg";
  const swiperRef = useRef<SwiperType>();

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
  return (
    <>
      {/* <h1
        className={
          styles["text-shadow"] +
          ` text-2xl font-extrabold sm:text-5xl z-50 border-black text-white absolute sm:top-[5.5rem] -top-4`
        }
      >
        INCRIDEA <span className="tracking-tight">23</span>
      </h1> */}
      <div
        id="animation"
        className="relative mx-auto flex h-[65vw] w-[80vw] scale-[140%] items-center justify-center sm:top-20 md:h-[50vw] md:w-[50vw] md:scale-[105%]"
      >
        <Image
          fill
          priority
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/controller-tv.svg`}
          alt="svg"
          id="image"
          className=""
        ></Image>
        <div className="absolute z-10 h-[40vw] w-[40vw] md:right-[10vw] md:top-[19vw] md:h-[23.6vw] md:w-[40vw]">
          <Swiper
            onBeforeInit={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            mousewheel={true}
            modules={[Navigation, Autoplay, Mousewheel]}
            autoplay={true}
            className="relative -left-[10.1vw] top-[-4.1vw] z-50 h-[30.8vw] w-[61vw] md:left-[5.3vw] md:top-[-9.1vw] md:h-[19.3vw] md:w-[38.3vw]"
          >
            {imgArr.map((img, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="flex cursor-pointer items-center justify-center text-center"
                  onClick={() => {
                    setActiveModal(true);
                    setActiveIndex(index);
                  }}
                >
                  {index === 0 && (
                    <ToolTip
                      classValue="top-[0] text-center sm:right-[14vw] bg-black/60 right-0 text-xs border sm:text-lg cursor-pointer"
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
                  className="object-cover blur-xl"
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
                  ` absolute left-0 top-0 z-50 w-full bg-transparent p-2 text-center text-base text-white md:text-lg md:font-extrabold`
                }
              >
                Click to Watch After Movie
              </button>
            </SwiperSlide>
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={`animate- absolute left-[41.5vw] top-[12vw] h-[9vw] w-[9vw] rounded-full opacity-40 transition-all duration-300 ease-in-out active:bg-gray-800 md:left-[18.5vw] md:top-[18.5vw] md:h-[1.5vw] md:w-[1.5vw]`}
          >
            {/* <ToolTip
              classValue="top-[-1vw] sm:right-[3vw] text-xs right-0 border sm:text-base"
              text="prev image"
            ></ToolTip> */}
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="animate- absolute left-[41.5vw] top-[22vw] h-[9vw] w-[9vw] rounded-full opacity-40 transition-all duration-300 ease-in-out active:bg-gray-800 md:left-[20.5vw] md:top-[18.5vw] md:h-[1.5vw] md:w-[1.5vw]"
          >
            {/* <ToolTip
              classValue="top-[-6vw] sm:right-[-1.5vw] text-xs right-0 border sm:text-base"
              text="next image"
            ></ToolTip> */}
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
            afterMovieLink="8Veb3u0xEoE"
            thumbnailSrc={thumbnailSrc}
          />
        </Modal>
      </div>
    </>
  );
};

export default Console;
