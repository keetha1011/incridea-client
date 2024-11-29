import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BlurImage from "~/components/blurImage";
import Modal from "~/components/galleryslide/gallery-modal";
import PreviewComponent from "~/components/galleryslide/previewComponent/preview-component";
import styles from "~/components/galleryslide/styles/shadow.module.css";
import { env } from "~/env";

import ToolTip from "./tool-tip";

const RetroTV = ({ imgArr }: { imgArr: string[] }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimatingRight, setAnimatingRight] = useState(false);
  const [isAnimatingLeft, setAnimatingLeft] = useState(false);
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
  const swiperRef = useRef<SwiperType>();
  const thumbnailSrc = "/thumbnails/incridea22.jpg";
  // sm:top-20 lg:top-64 md:top-16 -top-6
  return (
    <div
      id="animation"
      className="relative -top-10 mx-auto flex h-[65vw] w-[80vw] scale-[140%] items-center justify-center md:h-[60vw] md:w-[40vw] md:scale-[135%]"
    >
      {/* <h1
        className={
          styles["text-shadow"] +
          ` text-2xl font-extrabold sm:text-4xl z-50 border-black text-white absolute sm:top-20 lg:top-72 md:top-16 -top-2`
        }
      >
        INCRIDEA <span className="tracking-tight">22</span>
      </h1> */}
      <Image
        fill
        priority
        src="assets/svg/retro-tv.svg"
        alt="svg"
        id="image"
        className=""
      ></Image>
      <div className="absolute z-10 h-[40vw] w-[40vw] md:right-[10vw] md:top-[21.9vw] md:h-[23.6vw] md:w-[40vw]">
        <Swiper
          onBeforeInit={(swiper: SwiperType) => {
            swiperRef.current = swiper;
          }}
          mousewheel={true}
          modules={[Navigation, Autoplay, Mousewheel]}
          autoplay={true}
          className="relative -left-[9vw] top-[11.8vw] z-50 h-[36.8vw] w-[46vw] md:left-[6.3vw] md:top-[3.2vw] md:h-[21.9vw] md:w-[27.8vw]"
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
                    classValue="text-center bg-black/60 text-xs border sm:text-lg"
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
          onClick={() => handleButtonClickPrev()}
          className={`absolute left-[41.5vw] top-[12vw] h-[9vw] w-[9vw] rounded-full border-white transition-all duration-300 ease-in-out md:left-[43vw] md:top-[3.4vw] md:h-[5vw] md:w-[5vw] ${
            isAnimatingLeft ? "animate-ping border-2 sm:border-8" : ""
          }`}
        >
          <ToolTip
            classValue="text-xs border top-0 px-0 bg-black/50"
            text="prev image"
          ></ToolTip>
        </button>
        <button
          onClick={() => handleButtonClickNext()}
          className={`absolute left-[41.5vw] top-[22vw] h-[9vw] w-[9vw] rounded-full border-white transition-all duration-300 ease-in-out md:left-[43vw] md:top-[9.5vw] md:h-[5vw] md:w-[5vw] ${
            isAnimatingRight ? "animate-ping border-2 sm:border-8" : ""
          }`}
        >
          <ToolTip
            classValue="text-xs border bg-black/50"
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
          afterMovieLink="JHgT5PzLc4Q"
          index={activeIndex}
          thumbnailSrc={thumbnailSrc}
        />
      </Modal>
    </div>
  );
};

export default RetroTV;
