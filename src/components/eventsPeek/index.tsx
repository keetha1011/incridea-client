import Image from "next/image";
import React, { FC } from "react";

import { env } from "~/env";

const EventsPeek: FC<{
  speed: number;
}> = ({ speed }) => {
  const images = [
    "Battle_of_Bands_WEB.jpg",
    "Copy_of_NAVARASA_WithoutContact.png",
    "Desafio.jpg",
    "Stomp_That.jpg",
    "VibeV3.jpg",
    "COUTURE_WEB.jpg",
    "Knuckle_Down.jpg",
    "TULU_POSTER_WEB.jpg",
    "usaravalli_3x.jpg",
    "Hogathon.jpg",
    "Battle_of_Bands_WEB.jpg",
    "Copy_of_NAVARASA_WithoutContact.png",
    "Desafio.jpg",
    "Stomp_That.jpg",
    "VibeV3.jpg",
    "COUTURE_WEB.jpg",
    "Knuckle_Down.jpg",
    "TULU_POSTER_WEB.jpg",
    "usaravalli_3x.jpg",
    "Hogathon.jpg",
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return !isMobile ? (
    <section style={{ transform: "translateX(-60%)", willChange: "transform" }}>
      <div
        data-scroll
        data-scroll-speed={speed}
        data-scroll-direction="horizontal"
        className="flex w-[500%] items-center gap-2 py-2 backdrop-filter md:w-[350%] lg:w-[250%]"
      >
        {images.slice(0, 10).map((i, idx) => {
          return (
            <div className="flex items-start justify-center gap-5" key={idx}>
              <Image
                src={
                  env.NEXT_PUBLIC_BASE_IMAGE_URL +
                  "/assets/Core_Event_Posters/" +
                  i
                }
                alt="Gallery Image"
                width={500}
                height={300}
              />
              <div className="absolute left-0 top-0 h-full w-full bg-blue-300 bg-opacity-[3%]"></div>
            </div>
          );
        })}
      </div>
    </section>
  ) : (
    <>
      <div className="relative w-full">
        <div className="relative right-20 top-28 m-auto w-[200%] rotate-[15deg] overflow-hidden py-2">
          <ul
            className="flex w-[calc(250px*20)] animate-scroll-reverse"
            style={{
              transition: "all",
              willChange: "translate, transform",
              transitionDelay: "10ms",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            {images.map((i, idx) => {
              return (
                <li className="w-[250px] px-1 py-2" key={idx}>
                  <Image
                    src={
                      env.NEXT_PUBLIC_BASE_IMAGE_URL +
                      "/assets/Core_Event_Posters/" +
                      i
                    }
                    alt={i.slice(0, i.indexOf("."))}
                    width={500}
                    height={300}
                  />
                  <div className="absolute left-0 top-0 h-full w-full bg-blue-300 bg-opacity-[1%]"></div>
                </li>
              );
            })}
          </ul>
          <div className="absolute inset-0 h-full w-[200%] py-10 backdrop-blur-sm"></div>
        </div>

        <div className="relative -top-36 right-20 m-auto w-[200%] -rotate-[15deg] overflow-hidden py-2">
          <ul
            className="flex w-[calc(250px*20)] animate-scroll"
            style={{
              transition: "all",
              willChange: "translate, transform",
              transitionDelay: "10ms",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            {images.map((i, idx) => {
              return (
                <li className="w-[250px] px-1 py-2" key={idx}>
                  <Image
                    src={
                      env.NEXT_PUBLIC_BASE_IMAGE_URL +
                      "/assets/Core_Event_Posters/" +
                      i
                    }
                    alt={i.slice(0, i.indexOf("."))}
                    width={500}
                    height={300}
                  />
                  <div className="absolute left-0 top-0 h-full w-full bg-blue-300 bg-opacity-[1%]"></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default EventsPeek;
