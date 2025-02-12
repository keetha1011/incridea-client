import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "~/components/loader";

import LoginCard from "~/components/login/card";
import { Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

type CardStyle = {
  opacity: string;
  transitionDuration: string;
  pointerEvents: React.CSSProperties["pointerEvents"];
};

const CARD_SWITCH_DURATION = 1000; // in ms

const CARD_TOP_STYLE = {
  opacity: "0%",
  transitionDuration: "500ms",
  pointerEvents: "none" as React.CSSProperties["pointerEvents"],
};

const CARD_NEUTRAL_STYLE = {
  opacity: "100%",
  transitionDuration: "3000ms",
  pointerEvents: "auto" as React.CSSProperties["pointerEvents"],
};

const CARD_BOTTOM_STYLE = {
  opacity: "100%",
  transitionDuration: "1500ms",
  pointerEvents: "none",
};

const SignIn: NextPage = () => {
  const router = useRouter();

  const { user, loading: userLoading } = useAuth();

  const {
    query,
  }: {
    query: {
      whichForm?: "signIn" | "resetPassword" | "signUp" | "resendEmail";
      redirectUrl?: string;
    };
  } = useRouter();

  console.log("query", query);

  const [whichForm, setWhichForm] = useState<
    "signIn" | "resetPassword" | "signUp" | "resendEmail"
  >(query.whichForm ?? "signUp");


  const [smallGearRadius, setSmallGearRadius] = useState<number>(0);
  const [largeGearRadius, setLargeGearRadius] = useState<string>("0");

  const [bottom1, setBottom1] = useState<string>("90%");
  const [scale1, setScale1] = useState<string>("");

  const [smallGearAngle, setRotationAngle1] = useState<number>(0);
  const [largeGearAngle, setRotationAngle2] = useState<number>(0);

  const [transitioning, setTransitioning] = useState<boolean>(false);

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

  const changeCard = (newForm: "signIn" | "resetPassword" | "signUp" | "resendEmail") => {
    if (whichForm === newForm || transitioning) return;

    const audio1 = new Audio("/2025/audio/gearsounds.mp3");
    void audio1.play()

    setRotationAngle1((prev) => prev + 360);
    setRotationAngle2((prev) => prev - 360);

    setTransitioning(true);

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
      setTimeout(() => {
        setTransitioning(false);
        audio1.pause();
      }, CARD_SWITCH_DURATION);
    }, CARD_SWITCH_DURATION);

    setWhichForm(newForm);
  };


  useEffect(() => {
    const controller = new AbortController();

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setSmallGearRadius(screenWidth * 0.8);
        setLargeGearRadius("300vw");
        setScale1("1.4");
        setBottom1("80%");
      } else if (screenWidth < 1400) {
        setSmallGearRadius(screenWidth * 0.8);
        setLargeGearRadius("160vw");
        setScale1("");
        setBottom1("80%");
      } else if (screenWidth < 1500) {
        setSmallGearRadius(screenWidth * 0.8);
        setLargeGearRadius(`${screenWidth}px`);
        setScale1("");
        setBottom1("80%");
      } else {
        setSmallGearRadius(screenWidth * 0.8);
        setLargeGearRadius(`${screenWidth}px`);
        setScale1("");
        setBottom1("80%");
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize, {
      signal: controller.signal
    });
  }, []);


  if (userLoading)
    return <Loader />;

  if (user) {
    if (user.role !== Role.User) {
      void router.push("/profile");
      return null;
    }
    void router.push("/register");
    return null;
  }


  return (
    <>
      <div className="h-16" />
      <Image
        fill={true}
        className="object-cover blur-[3px]"
        src={`/2025/login/bg-login.jpeg`}
        alt={"loginBG"}
        quality={100}
        priority
      />
      <div
        className={`relative flex min-h-[73vh] h-screen flex-col justify-between [perspective:500px] [transform-style:preserve-3d] overflow-hidden`}
      >
        <div className="relative w-[500vw] h-[160vh] flex items-center justify-center self-center">
          <div
            style={{
              width: smallGearRadius,
              height: smallGearRadius,
              left: "42%",
              bottom: bottom1,
              rotate: "18deg",
              transform: `rotate(${smallGearAngle}deg)`,
              transition: "transform 2s ease-in-out",
              scale: scale1,
            }}
            className="absolute scale-150 translate-y-1/2"
          >
            <div className="relative size-full">
              <Image src="/2025/login/gear.webp" alt="Gear" fill priority />
            </div>
          </div>
          <div
            style={{
              top: "18%",
              width: largeGearRadius,
              height: largeGearRadius,
              transform: `rotate(${largeGearAngle}deg)`,
              transition: "transform 2s ease-in-out",
            }}
            className="fixed translate-y-1/2 h-full scale-[1.85]"
          >
            <div className="absolute size-full">
              <Image src="/2025/login/gear.webp" alt="Gear" priority fill />
            </div>
            <div className="size-full relative">
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
            </div>
          </div>
        </div>
      </div>
    </>
  )

};

export type { CardStyle };
export default SignIn;
