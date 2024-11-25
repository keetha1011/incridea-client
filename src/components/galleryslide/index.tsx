import { FC } from "react";
import "swiper/css";

import Console from "./devices/conosole-component";
import FinalComponent from "./devices/final-component";
import GbaComponent from "./devices/gba-component";
import RetroPC from "./devices/retropc-component";
import RetroTV from "./devices/retrotv-component";

type GalleryProps = {
  title: number;
  imgArr: string[];
  emulator: "gba" | "retroPC" | "console" | "retroTV" | "final";
};

const GallerySlide: FC<GalleryProps> = ({ title, imgArr, emulator }) => {
  switch (emulator) {
    case "gba":
      return <GbaComponent imgArr={imgArr} />;

    case "retroPC":
      return <RetroPC imgArr={imgArr} />;

    case "console":
      return <Console imgArr={imgArr} />;

    case "retroTV":
      return <RetroTV imgArr={imgArr} />;

    case "final":
      return <FinalComponent />;
  }
};

export default GallerySlide;
