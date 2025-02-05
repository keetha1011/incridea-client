import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import {
  ExternalLink,
  Volume2,
  VolumeX,
  MousePointerClick,
  ArrowDown,
} from "lucide-react";
import { type Sponsor } from "~/constants/sponsors";

const SponsorGearCarousel = ({ sponsors }: { sponsors: Sponsor[] }) => {
  // ... previous refs and state remain the same ...
  const titleRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const containerRef = useRef(null);
  const smallGearRef = useRef(null);
  const largeGearRef = useRef(null);
  const cardRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);
  const [showAudioHelper, setShowAudioHelper] = useState(true);

  useEffect(() => {
    audioRef.current = new Audio("/assets/audio/GearClockAudio.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    gsap.from([smallGearRef.current, largeGearRef.current], {
      rotation: 360,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.2,
    });

    // Animate scroll helper
    gsap.to(".scroll-helper", {
      y: "10px",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Animate audio helper
    gsap.to(".audio-helper", {
      y: "-5px",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const handleScroll = () => {
      // ... previous scroll handling code remains the same ...
      if (isAnimating.current) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        if (!isAnimating.current) {
          isAnimating.current = true;

          if (isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
              console.error("Failed to play audio:", error);
              setIsSoundEnabled(false);
            });
          }

          gsap.to(smallGearRef.current, {
            rotation: `+=${scrollingDown ? 30 : -30}`,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });

          gsap.to(largeGearRef.current, {
            rotation: `+=${scrollingDown ? -30 : 30}`,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });

          gsap
            .timeline()
            .to(cardRef.current, {
              opacity: 0,
              scale: scrollingDown ? 0.8 : 1.2,
              duration: 0.4,
              ease: "power2.inOut",
            })
            .call(() => {
              setCurrentIndex((prev) => {
                if (scrollingDown) {
                  return prev === sponsors.length - 1 ? 0 : prev + 1;
                } else {
                  return prev === 0 ? sponsors.length - 1 : prev - 1;
                }
              });
            })
            .to(cardRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              onComplete: () => {
                isAnimating.current = false;
              },
            });
        }
      }, 100);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sponsors.length, isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    setShowAudioHelper(false);
  };

  return (
    <div
      className="h-screen w-full bg-[#002c1b] fixed top-0 left-0 overflow-hidden"
      ref={containerRef}
    >
      {/* ... previous title and background code remains the same ... */}
      <div ref={titleRef} className="absolute top-4 left-0 right-0 z-10">
        <div className="mx-auto flex w-fit flex-col items-center gap-2 py-16 px-10">
          <h1 className="relative text-center font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-amber-500">
            OUR SPONSORS
            <div className="absolute -inset-4 -z-10 animate-pulse rounded-lg bg-emerald-900/50 blur-lg" />
          </h1>
          <p className="text-center text-[1rem] md:text-lg text-emerald-300">
            Iconic names coming together for an extraordinary fest
          </p>
        </div>
      </div>

      {/* Audio Helper */}
      {showAudioHelper && (
        <div className="audio-helper fixed top-[15%] sm:top-[10%] sm:right-[2%] z-50 flex flex-col items-center">
          <div className="bg-amber-500/10 backdrop-blur-sm rounded-lg p-2 mb-2">
            <p className="text-amber-500 text-sm whitespace-nowrap">
              Tap here to enable audio
            </p>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500/10" />
        </div>
      )}

      {/* Scroll Helper */}
      <div className="scroll-helper fixed top-[50%] left-0 sm:left-auto md:right-2 md:top-[55%] -translate-y-1/2 flex flex-col items-center gap-3 text-amber-500">
        <MousePointerClick className="w-4 h-4 sm:w-6 sm:h-6" />
        <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6" />
        <p
          className="text-[0.75rem] sm:text-[0.9rem] lg:text-[1rem] font-medium writing-mode-vertical transform rotate-0"
          style={{ writingMode: "vertical-lr" }}
        >
          Slowly scroll up-down to explore more sponsors
        </p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <button
        onClick={toggleSound}
        className="absolute top-[10%] sm:top-[15%] sm:right-4 z-50 p-2 sm:p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-full transition-colors"
        aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
      >
        {isSoundEnabled ? (
          <Volume2 className="sm:w-6 sm:h-6 text-amber-500" />
        ) : (
          <VolumeX className="sm:w-6 sm:h-6 text-amber-500" />
        )}
      </button>

      {/* ... rest of the component remains the same ... */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={smallGearRef}
          className="absolute left-[5%] top-[45%] sm:left-[10%] sm:top-[50%] md:left-[13%] md:top-[60%] lg:left-[22%] lg:top-[59%] xl:left-[22%] xl:top-[60%] -translate-y-1/2"
        >
          <div className="w-72 h-72 sm:w-[301px] sm:h-[301px] md:w-72 md:h-72 lg:w-[291px] lg:h-[291px]">
            <img
              src="/2025/sponsors/GearClock.png"
              alt="SmallGear"
              className="w-full h-full"
            />
          </div>
        </div>

        <div
          ref={largeGearRef}
          className="absolute left-[10%] top-[72%] sm:left-[30%] sm:top-[50%] md:left-[30%] md:top-[59%] lg:left-[32%] lg:top-[62%] xl:left-[32%] xl:top-[63%] -translate-y-1/2"
        >
          <div className="sm:w-[541px] sm:h-[541px] md:w-[581px] md:h-[581px] lg:w-[721px] lg:h-[721px]">
            <img
              src="/2025/sponsors/GearClock.png"
              alt="LargerGear"
              className="w-full h-full"
            />
          </div>
        </div>

        <div
          ref={cardRef}
          className="absolute top-[58%] sm:top-[60%] md:left-[20%] md:top-[58%] lg:left-[32%] lg:top-[63%] -translate-y-1/2 w-[90%]  sm:w-[80%] sm:h-[70%] md:w-[521px] md:h-[70%] lg:w-[576px] max-h-[70vh]"
        >
          <div className="bg-[#054432]/90 backdrop-blur-sm rounded-xl border-2 border-amber-500/50 shadow-lg p-4 md:p-6 hover:border-amber-500 transition-colors">
            <div className="flex flex-col items-center gap-4">
              {sponsors[currentIndex]?.title && (
                <h3 className="text-center text-2xl font-serif text-amber-500">
                  {sponsors[currentIndex].title}
                </h3>
              )}
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                {sponsors[currentIndex] && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/sponsors/${sponsors[currentIndex].logo}`}
                    fill
                    alt={sponsors[currentIndex].name}
                    className="object-contain"
                  />
                )}
              </div>

              <div className="text-center">
                {sponsors[currentIndex] && (
                  <>
                    <h3 className="text-2xl font-serif text-amber-500 mb-2">
                      {sponsors[currentIndex].name}
                    </h3>
                    <p className="text-emerald-100/90 text-base">
                      {sponsors[currentIndex].desc}
                    </p>
                  </>
                )}
              </div>

              {sponsors[currentIndex]?.websiteURL && (
                <a
                  href={sponsors[currentIndex].websiteURL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#054432] rounded-full hover:bg-amber-400 transition-all hover:scale-105"
                >
                  Visit Website
                  <ExternalLink className="transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorGearCarousel;
