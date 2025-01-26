import { type NextPage } from "next";
import Image from "next/image";

import ResetPassword from "~/components/form/resetPassword";
import { useEffect, useState } from "react";
import LoginPortal from "~/components/login/portal";
import { env } from "~/env";

const Reset: NextPage = () => {
  const [radius1, setRadius1] = useState<number>(0); // Small gear radius
  const [radius2, setRadius2] = useState<string>("0"); // Large gear radius
  const [rotationAngle1, setRotationAngle1] = useState<number>(0);
  const [rotationAngle2, setRotationAngle2] = useState<number>(0);
  const [bottom1, setBottom1] = useState<string>("90%");
  const [scale1, setScale1] = useState<string>("");
  const [gearPosition, setGearPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gearDistance, setGearDistance] = useState<number>(0);

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
      setScale1("1.4");
      setBottom1("80%");
    } else if (screenWidth < 1000) {
      gear2Radius = screenWidth; // Half the screen width
      gear1Radius = gear2Radius * 0.8; // Proportional size for smaller gear
      console.log("gear2Radius", gear2Radius);
      setRadius1(gear1Radius);
      setRadius2("160vw");
      setScale1("");
      setBottom1("80%");
    } else if (screenWidth < 1024) {
      gear2Radius = screenWidth / 1; // Half the screen width
      gear1Radius = gear2Radius * 0.8; // Proportional size for smaller gear
      console.log("gear2Radius", gear2Radius);
      setRadius1(gear1Radius);
      setRadius2(`${gear2Radius}px`);
      setScale1("");
      setBottom1("80%");
    } else {
      gear2Radius = screenWidth / 1;
      gear1Radius = gear2Radius * 0.8;

      setRadius1(gear1Radius);
      setRadius2(`${gear2Radius}px`);
      setScale1("");
      setBottom1("80%");
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

  return (
    <>
      <div className="h-16 bg-[#6a5fd7]"></div>

      <Image
        fill={true}
        className="mt-16 object-cover"
        src={`/assets/svg/copperbg.jpg`}
        alt={"loginBG"}
        quality={100}
        priority
      />

      <div
        className={`relative flex min-h-[93vh] flex-col justify-between overflow-hidden [perspective:500px] [transform-style:preserve-3d]`}
      >
        {/* <LoginPortal isTop={true} /> */}

        <div className="relative w-[500vw] h-[100vh] flex items-center justify-center self-center">
          <div
            style={{
              width: radius1,
              height: radius1,
              left: "42%",
              bottom: bottom1,
              rotate: "18deg",
              transform: `rotate(${rotationAngle1}deg)`,
              transition: "transform 2s ease-in-out",
              // animation:
              //   secondsAnimation !== "0s"
              //     ? `rotateClockwise ${secondsAnimation} linear infinite`
              //     : "rotateClockwise 20000s linear infinite",
              scale: scale1,
            }}
            className="absolute scale-150 translate-y-1/2"
          >
            <img src="/assets/svg/geardone2.svg" alt="" className="size-full" />
          </div>
          <div
            style={{
              top: "18%",
              width: radius2,
              height: radius2,
              transform: `rotate(${rotationAngle2}deg)`,
              transition: "transform 2s ease-in-out",
            }}
            className="fixed translate-y-1/2 h-full scale-[1.85]"
          >
            <img
              src="/assets/svg/geardone2.svg"
              alt=""
              className="absolute size-full"
            />

            <div className="size-full relative">
              <ResetPassword />
            </div>
          </div>
        </div>
        {/* <LoginPortal isTop={false} /> */}
      </div>
    </>
  );
};

export default Reset;
