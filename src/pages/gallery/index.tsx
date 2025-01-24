import { useEffect, useState } from "react";
import gsap from "gsap";
import { type NextPage } from "next";
import { FooterBody } from "~/components/footer";
import Clock from "~/components/galleryslide/clock";
import Inc20 from "~/components/galleryslide/scenes/Inc20";
import Inc22 from "~/components/galleryslide/scenes/Inc22";
import Inc23 from "~/components/galleryslide/scenes/Inc23";
import Inc24 from "~/components/galleryslide/scenes/Inc24";
import Parallax from "parallax-js";

const Gallery: NextPage = () => {
  const [activeYear, setActiveYear] = useState<number>(0);

  const backgroundImages: string[] = [
    "/assets/jpeg/inc20-gallerybg.jpg",
    "/assets/jpeg/inc22-gallerybg.jpg",
    "/assets/jpeg/inc23-gallerybg.jpg",
    "/assets/landing/landing@2x.png",
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

  const years = [2020, 2022, 2023, 2024] as const;
  const imageCounts = [29, 12, 26, 26] as const;

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

  const img2020 = generateImagePaths(years[0], imageCounts[0], "jpg");
  const img2022 = generateImagePaths(years[1], imageCounts[1], "jpg");
  const img2023 = generateImagePaths(years[2], imageCounts[2], "jpg").map(
    (path) => (path.startsWith("/") ? path : `/${path}`),
  );

  const renderActiveYearComponent = (): JSX.Element | null => {
    const components = [
      <Inc20 imageUrls={img2020} key={0} />,
      <Inc22 imgArr={img2022} key={1} />,
      <Inc23 imgArr={img2023} key={2} />,
      <Inc24 key={3} />,
    ];
    return components[activeYear] ?? null;
  };

  useEffect(() => {
    const parallaxContainer = document.getElementById("parallax-container");
    if (parallaxContainer) {
      const parallaxInstance = new Parallax(parallaxContainer, {
        relativeInput: true,
        hoverOnly: false,
      });
      return () => parallaxInstance.destroy();
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(
      "#active-year-content",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
    );

    return () => {
      gsap.to("#active-year-content", { opacity: 0, duration: 0.6 });
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
          {/* Parallax Effect */}
          <div
            id="parallax-container"
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -2 }}
          ></div>
          {/* Clock */}
          <div className="relative transform translate-y-10 md:-translate-y-10 z-20 top-28">
            <Clock onClockClick={handleClockClick} />
          </div>

          {/* Render Active Year Component with Fade Animation */}
          <div id="active-year-content" className="relative h-full w-full z-10">
            {renderActiveYearComponent()}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterBody />
    </>
  );
};

export default Gallery;
