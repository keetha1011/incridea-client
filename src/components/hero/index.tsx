// @refresh reset
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import TextAnimation from "~/components/animation/text";
import { env } from "~/env";

const Hero: React.FC = () => {
  const { RiveComponent: LandingBg } = useRive({
    src: `assets/rive/landing-scene-bg-1.riv/`,
    stateMachines: ["state-machine"],
    autoplay: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.BottomCenter,
    }),
  });
  const { RiveComponent: LandingWave } = useRive({
    src: `assets/rive/landing-scene-wave-1.riv/`,
    stateMachines: ["state-machine"],
    autoplay: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.BottomCenter,
    }),
  });

  return (
    <section
      data-scroll-section
      style={{ willChange: "transform" }}
      className="relative -z-10 bg-gradient-to-bl from-indigo-200 via-sky-500 to-cyan-100"
    >
      {/* 1. Sun Rays */}
      <Image
        className="absolute right-0 top-0 z-50 hidden md:block"
        data-scroll
        data-scroll-speed="2"
        src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/lensflare.webp`}
        width={1000}
        height={1000}
        alt="flare"
        priority
      />
      {/* 2. Background Animation */}
      <motion.div
        data-scroll
        data-scroll-speed="-8"
        className="absolute left-0 top-9 -z-10 md:top-0"
      >
        <LandingBg className="h-[70vh] w-screen md:h-screen" />
      </motion.div>

      {/* 3. Hero Title */}
      <motion.div
        data-scroll
        data-scroll-speed="-6"
        className="absolute -top-20 right-0 -z-10 flex min-h-screen w-screen flex-col items-center justify-center text-white backdrop-blur-[1px] md:top-0"
      >
        <Image
          className="h-fit w-full max-w-lg px-10"
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
          priority
          width={500}
          height={500}
          alt="INCRIDEA"
        />
        <TextAnimation
          text="Tides Of Change"
          textStyle={`titleFont drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] text-xl sm:text-3xl font-semibold tracking-widest`}
        />
      </motion.div>

      {/* 4. Foreground Animation */}
      <LandingWave className="z-0 h-[75vh] w-screen md:h-screen" />
    </section>
  );
};

function Sun() {
  return (
    <div className="relative h-40 w-40 rounded-full bg-yellow-400">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={`absolute h-2 w-full rounded-full ${
            index % 2 === 0 ? "bg-transparent" : "bg-yellow-500"
          }`}
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${index * 45}deg) translateY(-50%)`,
            background: `linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)`,
          }}
        />
      ))}
    </div>
  );
}

export default Hero;
