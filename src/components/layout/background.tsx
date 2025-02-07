import React, { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Particles from "react-tsparticles";
import { particlesConfig } from "./particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function BackGroundGradient({
  children,
}: {
  children?: React.ReactNode;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine, true);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await new Promise<void>((resolve) => resolve());
    },
    [],
  );

  useEffect(() => {
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        {
          background:
            "linear-gradient(40deg , rgba(0,51,31,1) 10%, rgba(0,102,63,1) 30%, rgba(0,51,31,1) 90%)",
        },
        {
          background:
            "linear-gradient(40deg , rgba(0,51,31,1) 10%, rgba(0,102,63,1) 70%, rgba(0,51,31,1) 90%)",
          repeat: -1,
          yoyo: true,
          duration: 6,
          ease: "power1.inOut",
        },
      );
    }
  }, []);

  return (
    <div
      ref={bgRef}
      className="w-screen min-h-screen relative bg-[rgb(0,51,31)] backdrop-blur-3xl"
    >
      <Particles
        init={particlesInit}
        options={particlesConfig}
        loaded={particlesLoaded}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
