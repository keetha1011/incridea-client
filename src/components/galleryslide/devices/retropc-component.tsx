import Image from "next/image";
import { useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BlurImage from "~/components/blurImage";
import Modal from "~/components/galleryslide/gallery-modal";
import PreviewComponent from "~/components/galleryslide/previewComponent/preview-component";
import styles from "~/components/galleryslide/styles/shadow.module.css";
import { env } from "~/env";

import ToolTip from "./tool-tip";

interface RippleState {
  x: number;
  y: number;
  active: boolean;
}

const RetroPC = ({ imgArr }: { imgArr: string[] }) => {
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
  const [ripple, setRipple] = useState<RippleState>({
    x: 0,
    y: 0,
    active: false,
  });
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const swiperRef = useRef<SwiperType>();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipple({ x, y, active: true });

    setTimeout(() => setRipple({ x: 0, y: 0, active: false }), 800);
  };
  const [activeIndex, setActiveIndex] = useState(0);
  let thumbnailSrc = "/thumbnails/incridea20.jpg";
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      fs: 1,
    },
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
  const youtubePlayerRef = useRef<YouTube | null>(null);

  const handlePlay = (event: any) => {
    event.target.pauseVideo();
    setActiveIndex(imgArr.length);
    setActiveModal(true);
  };
  return (
    <div className="relative flex flex-col">
      {/* <h1
      id="animation"
        className={
          styles["text-shadow"] +
          ` absolute top-0 font-extrabold sm:text-6xl text-4xl z-50 border-black text-white`
        }
      >
        INCRIDEA <span className="tracking-tight">19</span>
      </h1> */}
      <div
        id="animation"
        className="relative top-0 mx-auto flex h-[60svw] w-[40svw] scale-[200%] items-center justify-center rounded-[85px] sm:top-20 md:scale-[95%]"
      >
        {/* <h1
        className={
          styles["text-shadow"] +
          ` text-lg font-extrabold sm:text-5xl z-50 border-black text-white absolute sm:top-32 top-2`
        }
      >
        INCRIDEA <span className="tracking-tight">20</span>
      </h1> */}
        <Image
          fill
          priority
          src="assets/svg/retro-pc.svg"
          alt="svg"
          id="image"
        ></Image>
        <div className="absolute right-[5svw] top-[19svw] z-10 h-[23.6svw] w-[50svw]">
          <Swiper
            onBeforeInit={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            mousewheel={true}
            modules={[Navigation, Autoplay, Mousewheel]}
            autoplay={true}
            className="relative -top-[7.3svw] left-[10svw] z-50 h-[25.3svw] w-[32.2svw]"
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
                      classValue="top-[0] text-center bg-black/60 sm:right-[10vw] right-0 text-xs border sm:text-lg"
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
                  ` absolute left-0 top-0 z-50 h-full w-full bg-transparent p-2 text-center text-base text-white md:text-lg md:font-extrabold`
                }
              >
                Click to Watch After Movie
              </button>
            </SwiperSlide>
          </Swiper>

          <button
            onClick={() => handleButtonClickPrev()}
            className={`absolute left-[svw] top-[19.2svw] h-[1.3svw] w-[4.2svw] rounded-lg border-white transition-all duration-300 ease-in-out ${
              isAnimatingLeft ? "animate-ping border-2 sm:border-4" : ""
            }`}
          >
            <ToolTip
              classValue="top-[2vw] bg-black/50 sm:right-[0vw] text-xs border sm:text-base"
              text="prev image"
            ></ToolTip>
          </button>
          <button
            onClick={() => handleButtonClickNext()}
            className={`absolute left-[40.7svw] top-[19.2svw] h-[1.3svw] w-[4.2svw] rounded-lg border-white transition-all duration-300 ease-in-out ${
              isAnimatingRight ? "animate-ping border-2 sm:border-4" : ""
            }`}
          >
            <ToolTip
              classValue="top-[2vw] bg-black/50 sm:right-[0vw] text-xs right-0 border sm:text-base"
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
            thumbnailSrc={thumbnailSrc}
            imgArr={imgArr}
            index={activeIndex}
            afterMovieLink="w0phDNAnUgA"
          />
        </Modal>
      </div>
    </div>
  );
};

export default RetroPC;
