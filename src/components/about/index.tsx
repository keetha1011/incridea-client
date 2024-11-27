import Image from "next/image";
import { FC } from "react";
import { BiDownload } from "react-icons/bi";

// import { VikingHell } from "~/pages/_app";
import TextAnimation from "~/components/animation/text";
import { env } from "~/env";
import { cn } from "~/lib/utils";

const About: FC = () => {
  const handleDownload = (path: string, name: string) => {
    // fallback to window.open if the browser doesn't support the download attribute
    const fileUrl = path;
    const fileName = name;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  return (
    <section
      data-scroll
      data-scroll-speed="5"
      className="group mx-auto mb-36 max-w-screen-xl px-4 py-8 text-white sm:px-6 sm:py-12 lg:mb-48 lg:px-8 lg:py-16"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="mt-12 max-w-2xl">
          <TextAnimation
            text="About Incridea"
            // className={VikingHell.className}
            textStyle="text-xl font-semibold lg:text-3xl"
          />
          <div className="bodyFont mt-4 space-y-2 text-sm lg:text-lg">
            <p>
              Incridea, a four-day National-Level extravaganza will play host to
              over 60 events, spanning the technical, non-technical, and
              cultural spheres, replete with cultural soirées and pronites,
              promising to be an experience of a lifetime.
            </p>
            <p>
              The stunning marine world, with all its wonders and marvels, will
              be unveiled before your very eyes, as you revel in the vivacity of
              these momentous days, forging memories that shall be etched in
              your minds forevermore.
            </p>
          </div>
        </div>

        <div className="mx-auto">
          <div className="relative w-fit text-center">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/emblem.png`}
              width={300}
              height={300}
              className={
                "transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110"
              }
              alt="Incridea Emblem"
            />
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/ryoko.png`}
              width={300}
              height={300}
              className="absolute bottom-0 w-auto transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105"
              alt="Incridea Ryoko"
            />
          </div>
          <div
            className={cn(
              "mt-2 flex items-center justify-center space-x-2 text-lg",
              // VikingHell.className,
            )}
          >
            <a
              onClick={() =>
                handleDownload(
                  `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/pdf/rulebook.pdf`,
                  `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/Rulebook.pdf`,
                )
              }
              className="text-md flex cursor-pointer items-center gap-2 rounded-bl-xl rounded-tr-xl bg-white/30 px-3 py-2 text-center font-semibold text-white transition duration-300 hover:bg-white/40 md:text-lg lg:text-xl"
            >
              <BiDownload /> Rule book
            </a>
            <a
              onClick={() =>
                handleDownload(
                  "https://drive.google.com/file/d/1mglh-NsLE_AOjY969olQNppZcQyr5p4F/view?usp=sharing",
                  `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/schedule.pdf`,
                )
              }
              className="text-md flex cursor-pointer items-center gap-2 rounded-bl-xl rounded-tr-xl bg-white/30 px-3 py-2 text-center font-semibold text-white transition duration-300 hover:bg-white/40 md:text-lg lg:text-xl"
            >
              <BiDownload /> Schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
