import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Particles from "react-tsparticles";
import gsap from "gsap";
import styles from "./loader.module.css";

const LoadingScreen = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const hourglassRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const hourglass = hourglassRef.current;

    // Fade in animation for the container
    gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
      },
    );

    gsap.to(logo, {
      scale: 1.25,
      duration: 1.25,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => {
      gsap.killTweensOf([container, logo, hourglass]);
    };
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#00000",
      },
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: "canvas" as const,
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 2,
        },
      },
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
        },
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: false,
        },
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none" as const,
        random: false,
        straight: false,
        out_mode: "out" as const,
        bounce: false,
      },
    },
    detectRetina: true,
  };

  return (
    <div ref={containerRef} className={styles.loadingScreen}>
      <div className="relative h-screen w-screen flex flex-col items-center justify-center">
        <div className={styles.background}>
          <div className={styles.particlesContainer}></div>
          {/* <Particles options={particlesOptions} /> */}
        </div>
        <div ref={hourglassRef} className={styles.hourglass}>
          <Image
            src="/assets/png/hourglass.png"
            width={150}
            height={150}
            alt="Echoes of Eternity Logo"
            priority
          />
        </div>
        <div ref={logoRef} className="absolute bottom-[30%] md:bottom-[20%]">
          <Image
            src="/assets/png/Echoes_of_Eternity_Logo.png"
            width={300}
            height={300}
            alt="Echoes of Eternity Logo"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
