import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";
import CenteredLoader from "../afterMovieLoader";
import YouTube, { YouTubePlayer, type YouTubeProps } from "react-youtube";
import Link from "next/link";

const Inc25 = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeModal, setActiveModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize afterMovies array to prevent unnecessary re-renders
  const afterMovies = useMemo(
    () => [
      ["/thumbnails/incridea18.webp", "GqqK4c2rDhM"],
      ["/thumbnails/incridea19.webp", "gmF72fu1w6A"],
      ["/thumbnails/incridea20.webp", "w0phDNAnUgA"],
      ["/thumbnails/incridea22.webp", "JHgT5PzLc4Q"],
      ["/thumbnails/incridea23.webp", "8Veb3u0xEoE"],
      ["/thumbnails/incridea24.webp", "YoWeuaSMytk"],
    ],
    [],
  );

  // Use ResizeObserver for more efficient window size detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const resizeObserver = new ResizeObserver(checkMobile);
    checkMobile();
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, []);

  const updateOpacity = useCallback(() => {
    if (!containerRef.current) return;

    const elements = Array.from(containerRef.current.children) as HTMLElement[];
    const rotationY = Number(
      gsap.getProperty(containerRef.current, "rotationY"),
    );

    // Batch DOM updates
    requestAnimationFrame(() => {
      elements.forEach((element, i) => {
        const elementRotationY = (rotationY + i * 60) % 360;
        const opacity = Math.max(
          0.3,
          Math.cos((elementRotationY * Math.PI) / 180),
        );
        element.style.opacity = opacity.toString();
      });
    });
  }, []);

  useEffect(() => {
    let animationID: gsap.core.Timeline | null = null;

    const animate = () => {
      if (containerRef.current) {
        animationID = gsap.timeline({
          repeat: -1,
          onUpdate: updateOpacity,
        });

        animationID.to(containerRef.current, {
          rotationY: "+=360",
          duration: isMobile ? 45 : 35, // Slower rotation on mobile
          ease: "linear",
        });
      }
    };

    animate();
    return () => {
      animationID?.kill();
    };
  }, [updateOpacity, isMobile]);

  const handleClick = useCallback((index: number) => {
    setActiveModal(true);
    setActiveIndex(index);
  }, []);

  const containerStyle = useMemo(
    () => ({
      transform: `rotateX(${isMobile ? -30 : -20}deg)`,
      transformStyle: "preserve-3d" as const,
    }),
    [isMobile],
  );

  return (
    <div className="flex items-center justify-center h-screen">
      <style>{`
        @keyframes rotate {
          from { transform: perspective(1000px) rotateY(0deg); }
          to { transform: perspective(1000px) rotateY(360deg); }
        }
      `}</style>
      <GlowingStars numStars={isMobile ? 150 : 300} />{" "}
      {/* Reduce stars on mobile */}
      <div
        className="absolute top-[50%] sm:top-[33%] perspective-1000"
        style={containerStyle}
      >
        <div className="absolute md:top-[45%] top-[15%] flex flex-col space-y-2 items-center justify-center w-full">
          <p className="text-white text-lg text-center">
            Time to make great memories
          </p>
          <Link
            target="_blank"
            href="https://capture.incridea.in"
            className="px-6 text-lg rounded-full text-white flex justify-center items-center font-semibold cursor-pointer"
          >
            Visit&nbsp;&nbsp;
            <img
              src="/assets/png/capture-logo.png"
              alt="Capture"
              className="h-6 cursor-pointer"
            />
          </Link>
        </div>

        <div
          ref={containerRef}
          className="md:w-[400px] w-[200px] md:h-[200px] h-[100px]"
          style={{
            transformStyle: "preserve-3d",
            animation: `rotate ${isMobile ? 45 : 35}s linear infinite`,
          }}
        >
          {afterMovies.map((src, i) => (
            <span
              key={i}
              onClick={() => handleClick(i)}
              className="absolute w-full h-full"
              style={{
                transform: `rotateY(${i * 60}deg) translateZ(${isMobile ? 200 : 400}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full z-50 cursor-pointer" />
              <MiniPlayer src={src[1] ?? ""} isMobile={isMobile} />
            </span>
          ))}
        </div>
      </div>
      <Modal
        showModal={activeModal}
        title="Gallery"
        onClose={() => setActiveModal(false)}
      >
        <PreviewComponent afterMovieLinks={afterMovies} index={activeIndex} />
      </Modal>
    </div>
  );
};

// Optimized GlowingStars component
const GlowingStars = ({ numStars }: { numStars: number }) => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    gsap.to(starsRef.current.children, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      repeat: -1,
      yoyo: true,
      stagger: {
        amount: 3,
        from: "random",
      },
    });
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: numStars }, (_, i) => {
      const size = Math.random() * 2;
      return (
        <span
          key={i}
          className="star absolute rounded-full bg-blue-300"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
          }}
        />
      );
    });
  }, [numStars]);

  return (
    <div ref={starsRef} className="absolute w-full h-full">
      {stars}
    </div>
  );
};

// Optimized MiniPlayer component
const MiniPlayer = ({ src, isMobile }: { src: string; isMobile: boolean }) => {
  const [clickThru, setClickThru] = useState(true);
  const [isZoomed, setIsZoomed] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const blackScreenRef = useRef<HTMLDivElement>(null);
  const YTPlayerRef = useRef<YouTubePlayer>(null);

  const onReady: YouTubeProps["onReady"] = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    YTPlayerRef.current = e.target;
    (YTPlayerRef.current as YouTubePlayerPatch).playVideo();
  };

  const onPlay = useCallback<NonNullable<YouTubeProps["onPlay"]>>(() => {
    if (blackScreenRef.current) {
      blackScreenRef.current.style.display = "none";
    }
    setClickThru(false);

    setTimeout(() => setIsZoomed(false), 3000);
  }, []);

  useEffect(() => {
    if (!isZoomed && containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1,
        duration: 3,
        ease: "power2.out",
      });
    }
  }, [isZoomed]);

  const youtubeOpts = useMemo(
    () => ({
      playerVars: {
        autoplay: 1,
        showinfo: 0,
        controls: 0,
        modestbranding: 0,
        disablekb: 1,
        fs: 0,
        loop: 0,
        playsinline: 0,
        rel: 0,
        mute: 1,
      },
    }),
    [],
  );

  return (
    <div className="absolute h-full w-full overflow-hidden bg-black">
      <div
        className={`absolute z-40 h-full w-full ${clickThru ? "pointer-events-none" : "pointer-events-auto"}`}
      />
      <div
        ref={blackScreenRef}
        className="absolute z-40 flex h-full w-full items-center justify-center bg-black"
      >
        <CenteredLoader />
      </div>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{ transform: `scale(${isMobile ? 3 : 2})` }}
      >
        <YouTube
          videoId={src}
          className="h-full w-full"
          iframeClassName="absolute h-full w-full"
          title="afterMovie"
          loading="eager"
          opts={youtubeOpts}
          onReady={onReady}
          onPlay={onPlay}
        />
      </div>
    </div>
  );
};

export default Inc25;
