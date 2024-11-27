import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import { env } from "~/env";

export default function ArcadeLoader() {
  const landingContainer = useRef(null);
  useGSAP(
    () => {
      if (!landingContainer.current) return;
      gsap.to(landingContainer.current, {
        scale: 13,
        translateY: 550,
        translateX: 200,
        duration: 2,
        delay: 0.5,
        ease: "power2.in",
        onComplete() {
          gsap.to(landingContainer.current, { opacity: 0, duration: 1 });
          setTimeout(() => {
            // setPageLoader(false);
            if (landingContainer.current) {
              (landingContainer.current as HTMLElement).style.pointerEvents =
                "none";
            }
            sessionStorage.setItem("arcadeLoader", "false");
          }, 1000);
        },
      });
    },
    { scope: landingContainer },
  );

  return (
    <section
      ref={landingContainer}
      className="absolute left-0 top-0 z-[999] flex min-h-screen w-full items-center justify-center"
    >
      <Image
        src={`/assets/landing/landing@2x.png`}
        alt="UI Incridea 2024"
        width={1920}
        height={1080}
        priority
        className="image absolute left-0 top-0 h-full w-full object-cover object-center"
      />
      <div className="relative aspect-video h-screen w-full min-w-max">
        <div className="absolute left-1/2 top-[39%] h-[12%] w-[8%] -translate-x-[60%]">
          <Image
            height={482}
            width={256}
            className="h-full w-full rounded-lg"
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/gif/nosignal.gif`}
            alt="no signal"
            priority
          />
        </div>
      </div>
      {/* <div className="absolute  translate-y-[18%]">
            <Arcade />
          </div> */}
    </section>
  );
}
