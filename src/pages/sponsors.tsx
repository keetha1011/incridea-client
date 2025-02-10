import React, { useState } from "react";
import { type NextPage } from "next";
import SponsorGearCarousel from "~/components/sponsorsCard";
import { ArrowDown, MousePointerClick, Volume2, VolumeX } from "lucide-react";

import { CONSTANT } from "~/constants";

const Sponsors: NextPage = () => {
  const [showAudioHelper, setShowAudioHelper] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    setShowAudioHelper(false);
  };

  return (
    <main className="mb-6 flex flex-col min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        {showAudioHelper && (
          <div className="audio-helper absolute mx-2 top-[16%] sm:top-[10%] left-[7%] sm:left-[2%] md:left-auto md:top-[8%] md:right-[2%] z-50 flex flex-col items-center">
            <div className="bg-amber-500/10 backdrop-blur-sm rounded-lg p-2 mb-2">
              <p className="text-amber-500 text-sm whitespace-nowrap">
                Tap here to enable audio
              </p>
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500/10" />
          </div>
        )}

        <button
          onClick={toggleSound}
          className="absolute mx-2 top-[13%] md:top-[12%] md:right-[4%] z-50 p-2 sm:p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-full transition-colors"
          aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
        >
          {isSoundEnabled ? (
            <Volume2 className="sm:w-6 sm:h-6 text-amber-500" />
          ) : (
            <VolumeX className="sm:w-6 sm:h-6 text-amber-500" />
          )}
        </button>
        <div className="scroll-helper mx-1 sm:mx-3 absolute top-[40%] left-auto lg:right-0  -translate-y-1/2 flex flex-col items-center gap-3 text-amber-500 z-10">
          <p
            className="text-[0.7rem] sm:text-[0.9rem] lg:text-[1rem] font-medium writing-mode-vertical transform rotate-0"
            style={{ writingMode: "vertical-lr" }}
          >
            Slowly scroll up-down to explore more sponsors
          </p>
          <MousePointerClick className="w-4 h-4 sm:w-6 sm:h-6" />
          <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div className="w-[98%] mx-auto py-8">
          <div className="mt-14 mx-auto flex w-fit flex-col items-center gap-2 px-10">
            <h1 className="relative font-life-craft text-center text-3xl md:text-4xl lg:text-5xl tracking-wider text-amber-500">
              Our Sponsors
              <div className="absolute -inset-4 -z-10 animate-pulse rounded-lg bg-emerald-900/50 blur-lg" />
            </h1>
            <p className="text-center text-[1rem] md:text-lg text-emerald-300">
              Fueling Eternity with Iconic names
            </p>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Scrollable carousel container */}
          <div className="absolute inset-0 min-h-[450px]">
            <SponsorGearCarousel
              sponsors={CONSTANT.SPONSORS}
              isSoundEnabled={isSoundEnabled}
              setIsSoundEnabled={setIsSoundEnabled}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sponsors;
