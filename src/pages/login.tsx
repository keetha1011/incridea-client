import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoginCard from "~/components/login/card";
import EasterBomb from "~/components/login/easterBomb";
import FallingItem from "~/components/login/fallingItem";
import LoginPortal from "~/components/login/portal";
import { env } from "~/env";

type CardStyle = {
  top: string;
  transitionDuration: string;
  opacity?: string;
  pointerEvents?: React.CSSProperties["pointerEvents"];
  transform: string;
};

// HACK: If "top" values are changed, please check LoginCard component logic once
const CARD_SWITCH_DURATION = 1000;
const CARD_TOP_STYLE: CardStyle = {
    top: "-50%",
    transitionDuration: "0s",
    opacity: "0%",
    pointerEvents: "none",
    transform: `translate(-50%, -50%) rotateX(45deg) scaleX(-0.2)`,
  },
  CARD_NEUTRAL_STYLE: CardStyle = {
    top: "50%",
    transitionDuration: `${CARD_SWITCH_DURATION}ms`,
    opacity: "100%",
    pointerEvents: "auto",
    transform: `translate(-50%, -50%) rotateX(0deg) scaleX(1)`,
  },
  CARD_BOTTOM_STYLE: CardStyle = {
    top: "150%",
    transitionDuration: `${CARD_SWITCH_DURATION}ms`,
    transform: `translate(-50%, -50%) rotateX(-45deg) scaleX(-0.2)`,
  };

const SignIn: NextPage = () => {
  const {
    query,
  }: {
    query: {
      whichForm?: "signIn" | "resetPassword" | "signUp" | "resendEmail";
      redirectUrl?: string;
    };
  } = useRouter();

  const [whichForm, setWhichForm] = useState<
    "signIn" | "resetPassword" | "signUp" | "resendEmail"
  >(query.whichForm ?? "signUp");

  const [radius1, setRadius1] = useState<number>(0); // Small gear radius
  const [radius2, setRadius2] = useState<string>("0"); // Large gear radius
  const [gearPosition, setGearPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [radius3, setRadius3] = useState<number>(0);

  const [cardStyle, setCardStyle] = useState<{
    signIn: CardStyle;
    signUp: CardStyle;
    resetPassword: CardStyle;
    resendEmail: CardStyle;
  }>({
    signIn: CARD_TOP_STYLE,
    resetPassword: CARD_TOP_STYLE,
    signUp: CARD_TOP_STYLE,
    resendEmail: CARD_TOP_STYLE,
    [whichForm]: CARD_NEUTRAL_STYLE,
  });

  const changeCard: (
    newForm: "signIn" | "resetPassword" | "signUp" | "resendEmail",
  ) => void = (newForm) => {
    if (whichForm === newForm) return;

    setCardStyle((prev) => ({
      ...prev,
      [whichForm]: CARD_BOTTOM_STYLE,
      [newForm]: CARD_NEUTRAL_STYLE,
    }));

    setTimeout(() => {
      setCardStyle((prev) => ({
        ...prev,
        [whichForm]: CARD_TOP_STYLE,
      }));
    }, CARD_SWITCH_DURATION * 0.9);

    setWhichForm(newForm);
  };

  const [gearDistance, setGearDistance] = useState<number>(0);

  // setRadius1(Math.max(400, window.screen.width * 0.6));
  // setRadius2(window.screen.width * 0.35);

  const resizer = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let gear1Radius: number;
    let gear2Radius: number;
    let top: number;
    // Dynamically calculate radii
    // if (screenWidth < 440) {
    //   gear2Radius = screenWidth / 0.4; // Half the screen width
    //   gear1Radius = gear2Radius; // Proportional size for smaller gear
    //   console.log("gear2Radius", gear2Radius);
    //   setRadius1(gear1Radius);
    //   setRadius2(gear2Radius);
    // }
    if (screenWidth < 600) {
      gear2Radius = screenWidth; // Half the screen width
      gear1Radius = gear2Radius * 0.8; // Proportional size for smaller gear
      console.log("gear2Radius", gear2Radius);
      setRadius1(gear1Radius);
      setRadius2("300vw");
    } else if (screenWidth < 1000) {
      gear2Radius = screenWidth; // Half the screen width
      gear1Radius = gear2Radius * 0.8; // Proportional size for smaller gear
      console.log("gear2Radius", gear2Radius);
      setRadius1(gear1Radius);
      setRadius2("160vw");
    } else if (screenWidth < 1024) {
      gear2Radius = screenWidth / 1; // Half the screen width
      gear1Radius = gear2Radius * 0.8; // Proportional size for smaller gear
      console.log("gear2Radius", gear2Radius);
      setRadius1(gear1Radius);
      setRadius2(`${gear2Radius}px`);
    } else {
      gear2Radius = screenWidth / 1;
      gear1Radius = gear2Radius * 0.8;

      setRadius1(gear1Radius);
      setRadius2(`${gear2Radius}px`);
    }

    // Calculate positioning for gear1 to attach to gear2
    const distancegear = gear1Radius / 2 + gear2Radius / 2; // Edge-to-edge distance
    setGearDistance(distancegear);
    const angle = 0; // Horizontal attachment, adjust angle for diagonal placement
    const x = gear2Radius - gear1Radius; // Attach gear1 to left edge of gear2
    const y = 0; // No vertical offset for alignment

    setGearPosition({ x, y });
  };

  useEffect(() => {
    resizer();
    window.addEventListener("resize", resizer);
  }, []);

  // setRadius3(Math.max(window.screen.width * 1));

  return (
    <>
      <div className="h-16 bg-[#6a5fd7]"></div>
      <Image
        fill={true}
        className="mt-16 object-cover blur-[3px]"
        src={`/assets/svg/copperbg.jpg`}
        alt={"loginBG"}
        quality={100}
        priority
      />

      <div
        className={`relative flex min-h-[93vh] h-screen flex-col justify-between [perspective:500px] [transform-style:preserve-3d] overflow-hidden`}
      >
        {/* <LoginPortal isTop={true} /> */}

        {/* TODO: Change the time delay here according to time delay set for free-fall animation in tailwind.config.js */}
        <div className="absolute -top-[10vh] left-2/4 -z-40 h-0 w-[65vw] -translate-x-2/4 md:w-[440px]">
          <FallingItem delay={0} />
          <FallingItem delay={2000} />
          <FallingItem delay={4000} />
          <FallingItem delay={6000} />
          <FallingItem delay={8000} />
        </div>

        <div className="absolute -top-[10vh] left-2/4 z-30 h-0 w-[65vw] -translate-x-2/4 md:w-[440px]">
          <EasterBomb />
        </div>

        {/* <div className="relative size-full">
          <img
            src="assets/svg/geardone2.svg"
            style={{
              width: radius1,
              height: radius1,
              right: "8%",
            }}
            className="absolute -translate-y-1/2 -translate-x-1/2"
            alt=""
          />
          <img
            src="assets/svg/geardone2.svg"
            style={{
              width: radius2,
              height: radius2,
              // left: `10% + ${gearDistance * Math.cos(45)}px`,
              left: "130%",
              bottom: "0%",
              // transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
            }}
            className="absolute -translate-x-[70%] translate-y-full scale-150 overflow-hidden"
            alt=""
          />
        </div> */}

        <div className="relative w-[500vw] h-[160vh] flex items-center justify-center self-center">
          {/* <div className="absolute w-[130vw] h-[130vh] bg-[url('http://localhost:3000/assets/svg/geardone2.svg')] bg-cover bg-center top-full -translate-y-1/2"></div> */}
          <img
            src="assets/svg/geardone2.svg"
            style={{
              width: radius1,
              height: radius1,
              left: "42%",
              bottom: "80%",
              rotate: "18deg",
              animation: "rotateClockwise 20s linear infinite",
            }}
            className="absolute scale-150 translate-y-1/2"
            alt=""
          />
          <style jsx global>{`
            @keyframes rotateClockwise {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes rotateAntiClock {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(-360deg);
              }
            }
          `}</style>

          <img
            src="assets/svg/geardone2.svg"
            style={{
              top: "18%",
              width: radius2,
              height: radius2,
              animation: "rotateAntiClock 20s linear infinite",
            }}
            className="absolute translate-y-1/2 h-full scale-[1.85]"
            alt=""
          />

          {/* <img
            src="assets/svg/geardone2.svg"
            style={{
              width: "1000px",
              height: "1000px",
              left: "100%",
              top: "100%",
            }}
            className="absolute -translate-y-1/2 scale-150  -translate-x-full"
            alt=""
          /> */}
        </div>

        <LoginCard
          whichForm="signIn"
          cardStyle={cardStyle.signIn}
          setWhichForm={changeCard}
          redirectUrl={query.redirectUrl}
        />

        <LoginCard
          whichForm="resetPassword"
          cardStyle={cardStyle.resetPassword}
          setWhichForm={changeCard}
        />
        <LoginCard
          whichForm="signUp"
          cardStyle={cardStyle.signUp}
          setWhichForm={changeCard}
        />
        <LoginCard
          whichForm="resendEmail"
          cardStyle={cardStyle.resendEmail}
          setWhichForm={changeCard}
        />

        {/* <LoginPortal isTop={false} /> */}
      </div>
    </>
  );
};

export type { CardStyle };
export default SignIn;
