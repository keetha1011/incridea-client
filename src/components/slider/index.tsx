// Carousel.tsx
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import SwiperCore from "swiper";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { generateEventUrl } from "~/utils/url";

import styles from "./styles.module.css";

interface CarouselProps {
  events?: { id: string; name: string; image: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ events = [] }) => {
  // Install Swiper modules
  SwiperCore.use([Navigation, Scrollbar, A11y]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="relative z-10 flex w-[300%] items-center justify-center">
      <div className={styles.carousel_container}>
        <Swiper
          navigation={{
            nextEl: `.${styles.swiper_button_next}`,
            prevEl: `.${styles.swiper_button_prev}`,
          }}
          draggable={true}
          onSlideChange={handleSlideChange}
          spaceBetween={40}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
        >
          {events.map((data, index) => (
            <SwiperSlide
              key={index}
              className={`${styles.swiper_slide} ${
                index === activeIndex ? `${styles.active}` : ""
              }`}
            >
              {data.image ? (
                <Link href={generateEventUrl(data.name, data.id)}>
                  {data.image && (
                    <Image
                      src={data.image}
                      alt={"Image"}
                      width={300}
                      height={300}
                      className="z-0 h-full w-full rounded-xl object-scale-down"
                    />
                  )}
                </Link>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-300">
                  No Image
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex-between flex items-center">
          <div
            className={`${styles.swiper_button_next} right-[30%] z-[1001] rounded-full opacity-90 sm:right-[20%] md:right-[10%] lg:right-0`}
          >
            <GoChevronRight size={30} />
          </div>
          <div
            className={`${styles.swiper_button_prev} left-[30%] z-[1001] rounded-full opacity-90 sm:left-[20%] md:left-[10%] lg:left-0`}
          >
            <GoChevronLeft size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
