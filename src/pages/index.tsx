import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import Parallax from "parallax-js";
import { type FC, useEffect, useRef, useState } from "react";
import { BsFillSuitHeartFill } from "react-icons/bs";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

export default function Landing() {
  const router = useRouter();

  return (
    <main className="relative h-screen overflow-hidden">
      <div className="absolute top-0">
        <HomeUi />
        {/* <Menu router={router} /> */}
        <HomeFooter />
      </div>
    </main>
  );
}

export const HomeFooter = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(!show);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [show]);
  return (
    <footer className="absolute bottom-0 flex w-full flex-col gap-2 text-gray-200 md:gap-4">
      {show && (
        <ul className="mb-5 flex flex-1 flex-row flex-wrap items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-xs md:gap-5">
          <li className="text-white transition-colors duration-300 hover:text-gray-300">
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          |
          <li className="text-white transition-colors duration-300 hover:text-gray-300">
            <Link href="/rules">Terms & Conditions</Link>
          </li>
          |
          <li className="text-white transition-colors duration-300 hover:text-gray-300">
            <Link href="/guidelines">Guidelines</Link>
          </li>
          |
          <li className="text-white transition-colors duration-300 hover:text-gray-300">
            <Link href="/refund">Refund Policy</Link>
          </li>
          |
          <li className="text-white transition-colors duration-300 hover:text-gray-300">
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      )}
      {!show && (
        <p className="pb-3 text-center text-xs">
          <Link
            className="flex items-center justify-center tracking-normal transition-all hover:tracking-widest hover:text-gray-300"
            href="/team"
          >
            Made with <BsFillSuitHeartFill className="mx-2" /> by Technical Team
          </Link>
          © Incridea 2024
        </p>
      )}
    </footer>
  );
};

export const Menu: FC<{
  router: NextRouter;
}> = ({ router }) => {
  const navItems = [
    { href: "/events", target: "Events" },
    { href: "/pronites", target: "Pronite" },
    { href: "/gallery", target: "Gallery" },
    { href: "/about", target: "About" },
    { href: "/sponsors", target: "Sponsors" },
    // TODO: remember to change in mainMenuModal.tsx
  ];

  const { user, loading } = useAuth();

  return (
    <div className="absolute bottom-0 left-0 flex h-full w-screen flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute bottom-10 my-24 hidden w-fit flex-col items-center gap-3 sm:flex-row md:gap-10 lg:flex">
        <Button
          intent={"primary"}
          className="h-fit w-52 px-4 sm:px-12"
          size={"xlarge"}
          onClick={async () => {
            if (loading) return;
            if (user) await router.push("/profile");
            else await router.push("/login");
          }}
        >
          {loading ? (
            <Spinner size="small" className="py-[2px]" intent={"white"} />
          ) : user ? (
            "Profile"
          ) : (
            "Register"
          )}
        </Button>
        <Button
          intent={"ghost"}
          className="h-fit w-52 px-4 sm:px-12"
          size={"xlarge"}
          onClick={async () => await router.push("/explore")}
        >
          Explore
        </Button>
      </div>
      <div className="absolute -right-8 bottom-[15%] flex h-fit w-fit flex-col space-y-5 lg:absolute">
        <h3
          className={cn(
            "hidden text-center text-2xl tracking-widest text-white sm:text-4xl md:mb-5 md:block",
            // VikingHell.className,
          )}
        >
          Menu
        </h3>
        {
          <>
            <Button
              intent={"ghost"}
              className="block w-52 justify-center !bg-primary-800/70 px-12 md:w-80 md:justify-end md:px-16 lg:hidden"
              size={"xlarge"}
              onClick={async () => {
                if (loading) return;
                if (user) await router.push("/profile");
                else await router.push("/login");
              }}
            >
              {loading ? (
                <Spinner size="small" className="py-[2px]" />
              ) : user ? (
                "Profile"
              ) : (
                "Register"
              )}
            </Button>
            <Button
              intent={"ghost"}
              className="block w-52 justify-center !bg-primary-800/70 px-12 md:w-80 md:justify-end md:px-16 lg:hidden"
              size={"xlarge"}
              onClick={async () => await router.push("/explore")}
            >
              Explore
            </Button>
          </>
        }
        {navItems.map((e, i) => (
          <Link key={i} href={e.href}>
            <Button
              className="w-52 justify-center px-12 md:w-80 md:justify-end md:px-16"
              size={"xlarge"}
            >
              {e.target}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const HomeUi = () => {
  const sceneRef = useRef<HTMLElement>(null);
  const largeClockRef = useRef(null);
  const smallClockRef = useRef(null);
  const floatingObjectsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    if (sceneRef.current)
      new Parallax(sceneRef.current, {
        relativeInput: true,
      });

    if (largeClockRef.current) {
      gsap.to(largeClockRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    }

    if (smallClockRef.current) {
      gsap.to(smallClockRef.current, {
        rotation: -360,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    }
  }, []);

  useGSAP(() => {
    floatingObjectsRef.current.forEach((obj, index) => {
      if (!obj) return;

      gsap.to(obj, {
        translateY: `${Math.sin(index) * 4}px`,
        translateX: `${Math.cos(index) * 4}px`,
        rotation: index % 2 === 0 ? 2 : -2,
        duration: 3 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });
  }, []);

  return (
    <>
      <section ref={sceneRef} className="relative min-h-screen bg-cover z-0">
        <div className="absolute h-screen w-screen" data-depth="0.4">
          <div className="absolute bottom-0 left-[50%] aspect-video h-[100vh] scale-110  md:left-0 md:h-full md:w-full md:-translate-x-0">
            <Image
              src={"/assets/landing/background.png"}
              alt="Gradient"
              width={1920}
              height={1080}
              className="h-full w-full object-coverß object-bottom"
            />
          </div>
        </div>
        <div
          data-depth="0.1"
          className="absolute flex h-screen w-screen items-center justify-center"
        >
          <div className="relative mx-auto w-fit p-5">
            <Image
              src={`/assets/landing/clock.png`}
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="absolute h-fit w-full max-w-xl object-contain object-center scale-[70%] -translate-x-8"
              ref={largeClockRef}
            />
            <Image
              src={`/assets/landing/clock.png`}
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="relative h-fit w-full max-w-xl object-contain object-center -translate-x-[1.25rem] translate-y-4 scale-[50%]"
              ref={smallClockRef}
            />
          </div>
        </div>

        <div className="absolute h-screen w-screen">
          <div className="absolute bottom-0 left-[50%] aspect-video h-[75vh] scale-110  md:left-0 md:h-full md:w-full md:-translate-x-0">
            <Image
              src={"/assets/landing/pillar.png"}
              alt="Gradient"
              width={1920}
              height={1080}
              className="h-full w-full object-contain object-bottom"
            />
          </div>
        </div>

        {/* Floating Objects */}

        {[1, 2, 3, 4, 5, 6, 7].map((item, idx) => (
          <div
            data-depth="0.1"
            className="absolute h-screen w-screen"
            key={idx}
          >
            <div
              ref={(el) => {
                floatingObjectsRef.current[idx] = el;
              }}
              className="absolute bottom-0 left-[50%] aspect-video h-[75vh] scale-95 -translate-x-1/2 -translate-y-16 md:left-0 md:h-full md:w-full md:-translate-x-0 transition-transform"
            >
              <Image
                src={`/assets/landing/floatingObjects/${item}.png`}
                alt="Gradient"
                width={1920}
                height={1080}
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          </div>
        ))}

        {/* EOE Text */}
        <div
          data-depth="0.05"
          className="absolute flex h-screen w-screen items-center justify-center z-20"
        >
          <div className="mx-auto w-fit p-5 relative">
            <Image
              src={`/assets/landing/EOEText.png`}
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full max-w-xl object-contain object-center  translate-y-[120%] -translate-x-4"
            />
          </div>
        </div>

        <div
          data-depth="0"
          className="absolute flex h-screen w-screen items-center justify-center pointer-events-none"
        >
          <div className="mx-auto w-fit p-5 relative">
            <Image
              src={`/assets/landing/EOEShadow.png`}
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full max-w-xl object-contain object-center z-0 translate-y-[120%]  opacity-85 blur-sm -translate-x-4"
            />
          </div>
        </div>
      </section>
    </>
  );
};
