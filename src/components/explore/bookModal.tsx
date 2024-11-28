import Image from "next/image";
import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import HTMLFlipBook from "react-pageflip";

import sponsors from "~/constants/sponsors";
import useStore from "~/components/store/store";
import { env } from "~/env";

interface BookModalType {
  isMuted: boolean;
  mainThemeAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const BookModal: React.FC<BookModalType> = ({ isMuted, mainThemeAudioRef }) => {
  const setSponsorFlag = useStore((state) => state.setSponsor);
  const sponsorFlag = useStore((state) => state.sponsor);

  useEffect(() => {
    const audio = new Audio(
      `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/audio/level2/pirates.mp3`,
    );
    audio.volume = 0.3;
    let mainRef = mainThemeAudioRef;
    if (isMuted) {
      return;
    } else if (!isMuted && sponsorFlag) {
      mainRef?.current?.pause();
      audio.play();
    }
    return () => {
      audio.pause();
      mainRef?.current?.play();
    };
  }, [sponsorFlag, isMuted, mainThemeAudioRef]);

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex h-screen items-center justify-center overflow-hidden bg-black bg-opacity-50 p-5 md:scale-[200%]">
        <HTMLFlipBook
          width={150}
          height={225}
          className=" "
          style={{}}
          startPage={0}
          size={"fixed"}
          minWidth={150}
          maxWidth={400}
          minHeight={225}
          maxHeight={600}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.1}
          showCover={false}
          mobileScrollSupport={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={2}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          <div className="relative">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/bookCoverTexture.jpg`}
              alt="cover"
              width={100}
              height={100}
              className="h-full w-full"
            />
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/DOD.png`}
              alt="Dice of Destiny"
              width={300}
              height={300}
              className="absolute top-[25%]"
            />
          </div>
          {sponsors.map((page, index) => {
            return (
              <div
                className="bg-[url('/assets/png/pageTexture.jpg')] bg-cover bg-center"
                key={index}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <Image
                    src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/sponsors/${page.logo}`}
                    alt={page.name}
                    width={300}
                    height={300}
                    className="h-24 w-24 object-contain"
                  />
                  <div className="flex flex-col text-center">
                    <span className="text-[0.6rem] font-semibold text-amber-800">
                      {page.title}
                    </span>
                    <span className="font-VikingHell tracking-wide text-white">
                      {page.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="relative">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/bookCoverTexture.jpg`}
              alt="cover"
              width={100}
              height={100}
              className="h-full w-full"
            />
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/DOD.png`}
              alt="Dice of Destiny"
              width={300}
              height={300}
              className="absolute top-[25%]"
            />
          </div>
        </HTMLFlipBook>
      </div>
      <div
        className="fixed right-[10%] top-[25%] z-[1001] cursor-pointer rounded-sm bg-primary-300 px-2 py-1 sm:right-[15%] md:right-[20%] lg:right-[25%] lg:top-[15%] xl:right-[30%]"
        style={{ pointerEvents: sponsorFlag ? "all" : "none" }}
        onClick={setSponsorFlag}
      >
        <IoMdClose className="text-lg text-white" />
      </div>
    </>
  );
};

export default BookModal;
