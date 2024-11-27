import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

import { env } from "~/env";

const AboutIncridea: FC = () => {
  let { scrollYProgress } = useScroll();
  let y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  return (
    <>
      <div className="relative h-96 w-full overflow-hidden">
        <motion.div style={{ y }} className="relative h-full w-full">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/incrediaAbout.png`}
            alt="Incridea Banner"
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-black"></span>
        </motion.div>
        <div className="absolute inset-0 flex h-full w-full items-center justify-center">
          <h1
            className={`titleFont p-5 text-center text-4xl text-white lg:text-7xl`}
          >
            About Incridea
          </h1>
        </div>
      </div>

      <div className="flex basis-1/2 flex-col items-center justify-center gap-10 p-5 lg:flex-row-reverse lg:gap-20 lg:p-10">
        <Image
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo-black.png`}
          alt="Incridea Logo"
          width={500}
          height={500}
          className="h-auto w-auto"
        />

        <div className="bodyFont basis-1/2 space-y-[1em] text-justify text-lg text-white lg:text-xl">
          <p>
            Incridea, the annual college festival of NMAM Institute of
            Technology, Nitte, has rapidly grown into one of the most awaited
            cultural events in the region within a short span of time. The
            festival has become a symbol of creativity, innovation, and fun,
            attracting students from various colleges across the country.
          </p>
          <p>
            Incridea is an entertainment hub that offers an array of 60+ events,
            including pronites, fashion shows, music, drama, sports, robotics,
            and coding competitions, with some being our flagship events. These
            events attract several thousand attendees and provide a platform for
            students to showcase their talents while connecting with peers from
            all over the country.
          </p>
          <p>
            Incridea&apos;s growth and success stand as a testament to
            NMAMIT&apos;s commitment to promoting student talent and creating
            unforgettable experiences for all attendees. As we move forward,
            we&apos;re excited to embrace the Tides of Change! Are you?
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutIncridea;
