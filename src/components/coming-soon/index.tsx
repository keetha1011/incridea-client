import { useEffect } from "react";
import MorphingText from "~/components/text-morph-component";
import ShootingStars from "./shooting-stars";
import gsap from "gsap";

const ComingSoonComponent = () => {
  useEffect(() => {
    gsap.to(".star", {
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

    if (window.innerWidth >= 1024) {
      gsap.fromTo(
        "#door-left",
        { x: "150%" },
        { x: "0%", duration: 2, delay: 0.5, ease: "back" },
      );
      gsap.fromTo(
        "#door-right",
        { x: "-150%" },
        { x: "0%", duration: 2, delay: 0.5, ease: "back" },
      );
    } else {
      gsap.fromTo(
        "#door-left",
        { y: "-17%" },
        { y: "-38%", duration: 2, delay: 0.5, ease: "back" },
      );
      gsap.fromTo(
        "#door-right",
        { y: "17%" },
        { y: "38%", duration: 2, delay: 0.5, ease: "back" },
      );
    }
    // } else if(window.innerWidth >= 640) {
    //     gsap.fromTo('#door-left', { y: "0%" }, { y: "-33.5%", duration: 2, delay: 0.5, ease: 'back' });
    //     gsap.fromTo('#door-right', { y: "0%" }, { y: "33.5%", duration: 2, delay: 0.5, ease: 'back' });
    // }

    gsap.fromTo(
      "#text-container",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.5 },
    );
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 250; i++) {
      const size = Math.random() * 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      stars.push(
        <span
          key={i}
          className="star absolute rounded-full bg-blue-300"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: Math.random(),
          }}
        />,
      );
    }
    return stars;
  };

  return (
    <div
      className="relative w-full h-screen select-none flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 50%, #033137 0%, #137C2D 70%)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "0% 0%",
      }}
    >
      <div className="absolute w-full h-full z-20">{renderStars()}</div>

      <a
        id="text-container"
        href="https://www.instagram.com/reel/DE2IY6FvbTm/?igsh=MTdsbnc1bjMyaXZuYw=="
        className="md:w-[60%] w-[80%] z-20"
      >
        <MorphingText
          texts={["Coming Soon", "Echoes of Eternity"]}
          className="blackChancery lg:text-[9rem] md:text-[6rem] text-[4rem] text-yellow-400 text-center min-w-full self-center justify-self-center"
        />
      </a>

      <div className="absolute w-full h-full z-20">
        <ShootingStars />
      </div>

      <img
        id="door-left"
        src="/assets/png/door.png"
        alt="Door-Left"
        className="absolute lg:h-full h-screen lg:w-[20%] md:scale-y-150 lg:scale-y-100 lg:left-0 lg:top-0 top-0 lg:rotate-0 rotate-90 z-30"
        draggable={false}
      />
      <img
        id="door-right"
        src="/assets/png/door1.png"
        alt="Door-Left"
        className="absolute lg:h-full h-screen lg:w-[20%] md:scale-y-150 lg:scale-y-100 lg:right-0 lg:bottom-0 lg:rotate-0 rotate-90 z-30"
        draggable={false}
      />
    </div>
  );
};

export default ComingSoonComponent;
