import { useEffect, useState } from "react";
import gsap from "gsap";
import { type NextPage } from "next";
import { FooterBody } from "~/components/footer";
import Clock from "~/components/galleryComponents/clock";
import Inc22 from "~/components/galleryComponents/scenes/Inc22";
import Inc23 from "~/components/galleryComponents/scenes/Inc23";
import Inc24 from "~/components/galleryComponents/scenes/Inc24";
import Inc25 from "~/components/galleryComponents/scenes/Inc25";
import Parallax from "parallax-js";

const Gallery: NextPage = () => {
  const [activeYear, setActiveYear] = useState<number>(0);

  const backgroundImages: string[] = [
    "/assets/galleryBg/inc22-gallerybg.jpg",
    "/assets/galleryBg/inc23-gallerybg.jpg",
    "/assets/galleryBg/inc24-gallerybg.jpg",
    "/assets/galleryBg/inc24-gallerybg.jpg",
  ];

  const handleClockClick = (angle: number) => {
    switch (angle) {
      case 0:
      case 2 * Math.PI:
        setActiveYear(2);
        break;
      case Math.PI / 2:
        setActiveYear(3);
        break;
      case (3 * Math.PI) / 2:
      case -Math.PI / 2:
        setActiveYear(1);
        break;
      case Math.PI:
        setActiveYear(0);
        break;
    }
  };

  const years = [2022, 2023, 2024] as const;
  const imageCounts = [12, 26, 26] as const;

  const generateImagePaths = (
    year: number,
    count: number,
    extension: string,
  ): string[] => {
    return Array.from(
      { length: count },
      (_, i) => `gallery/${year}/${i + 1}.${extension}`,
    );
  };

  const imgArr = [
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
    "assets/jpeg/Nakash.jpeg",
  ];

  const img2022 = generateImagePaths(years[0], imageCounts[0], "jpg");
  const img2023 = generateImagePaths(years[1], imageCounts[1], "jpg");
  const img2024 = generateImagePaths(years[2], imageCounts[2], "jpg");

  const renderActiveYearComponent = (): JSX.Element | null => {
    const components = [
      <Inc22 imgArr={imgArr} key={0} />,
      <Inc23 imgArr={imgArr} key={1} />,
      <Inc24 imgArr={imgArr} key={2} />,
      <Inc25 imgArr={imgArr} key={3} />,
    ];
    return components[activeYear] ?? null;
  };

  useEffect(() => {
    gsap.fromTo(
      "#active-year-content",
      { opacity: 0 },
      { opacity: 1, duration: 1 },
    );

    return () => {
      gsap.to("#active-year-content", { opacity: 0, duration: 1 });
    };
  }, [activeYear]);

  return (
    <>
      <section className="relative flex h-screen w-full flex-col overflow-hidden bg-black bg-opacity-50">
        <div
          className="relative h-screen w-full z-0 overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImages[activeYear]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative transform translate-y-10 md:-translate-y-10 z-20 top-28">
            <Clock onClockClick={handleClockClick} />
          </div>

          <div id="active-year-content" className="relative h-full w-full z-10">
            {renderActiveYearComponent()}
          </div>
        </div>
      </section>

      <FooterBody />
    </>
  );
};

export default Gallery;
