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
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";
import MetallicButton from "~/components/copperButton";

export default function Landing() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, []);

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
    <footer className="absolute bottom-0 flex w-full flex-col gap-2 text-gray-200 md:gap-4 pt-4 bg-black/50 backdrop-blur-sm h-16">
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
            Made with <BsFillSuitHeartFill className="mx-2 fill-red-700" /> by
            Technical Team
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
  const router = useRouter();

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
      <section
        ref={sceneRef}
        className="relative min-h-screen bg-cover z-0 select-none pointer-events-none"
      >
        <div className="absolute h-screen w-screen" data-depth="0.2">
          <div className="absolute top-0 left-1/2 md:-translate-x-[47%] -translate-x-[40%] w-full h-full scale-110 flex justify-center items-center">
            <Image
              src={"/assets/landing/background.webp"}
              priority
              alt="Background"
              width={1920}
              height={1080}
              className="h-full w-full object-cover md:scale-100 scale-[110%] mt-12"
            />
          </div>
        </div>

        <div
          data-depth="0.4"
          className=" h-screen w-screen flex justify-center items-center"
        >
          <div className="p-5 w-screen h-screen flex justify-center items-center mb-10 relative">
            <Image
              src={`/assets/landing/clock.webp`}
              priority
              width={640}
              height={640}
              alt="Clock 1"
              className="left-1/2 -translate-x-1/2 absolute md:top-[10%] md:w-[20%] w-[40%] top-[20%] object-contain object-center"
              ref={largeClockRef}
            />
            <Image
              src={`/assets/landing/clock.webp`}
              priority
              width={640}
              height={640}
              alt="Clock 2"
              className="absolute md:w-[12%] md:top-[17%] w-[20%] top-[25%] object-contain object-center"
              ref={smallClockRef}
            />
          </div>
        </div>

        <div className="absolute h-screen w-screen">
          <div className="w-full h-full relative">
            <Image
              src={"/assets/landing/pillar.webp"}
              priority
              alt="Pillar"
              width={1920}
              height={1080}
              className="md:h-[80%] h-[60%] absolute bottom-0 left-1/2 -translate-x-1/2 mt-auto w-full md:object-fill object-cover object-center"
            />
          </div>
        </div>

        {/* Floating Objects */}

        {[1, 2, 3, 4, 5, 6, 7].map((item, idx) => (
          <div
            data-depth="0.6"
            className="absolute h-screen w-screen"
            key={idx}
          >
            <div
              ref={(el) => {
                floatingObjectsRef.current[idx] = el;
              }}
              className="absolute lg:bottom-0 md:bottom-24 bottom-60 left-[50%] aspect-video w-screen md:scale-[90%] scale-[125%] -translate-x-1/2 -translate-y-16 transition-transform"
            >
              <Image
                src={`/assets/landing/floatingObjects/${item}.webp`}
                priority
                alt="Floating objects"
                width={1920}
                height={1080}
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          </div>
        ))}

        {/* EOE Text */}
        <div
          data-depth="0.1"
          className="absolute flex h-screen w-screen items-center justify-center z-20"
        >
          <div className="mx-auto w-screen h-screen p-5 relative">
            <Image
              src={`/assets/png/logo.png`}
              priority
              width={640}
              height={640}
              alt="Incridea"
              className="absolute md:w-[15%] left-1/2 -translate-x-1/2 top-[25%] w-[40%] object-contain object-center"
            />
          </div>
        </div>

        <div data-depth="0.1" className="absolute w-screen h-screen z-20">
          <Image
            src={`/assets/landing/EOEText.webp`}
            priority
            width={640}
            height={640}
            alt="EOE"
            className="md:w-[30%] w-[70%] left-1/2 absolute -translate-x-1/2 md:top-[40%] top-[50%] object-contain object-center"
          />
        </div>
        <div data-depth="0.05" className="absolute w-screen h-screen z-[19]">
          <Image
            src={`/assets/landing/EOEShadow.webp`}
            priority
            width={640}
            height={640}
            alt="EOE"
            className="md:w-[30%] w-[70%] left-1/2 absolute -translate-x-1/2 md:top-[40%] top-[50%] object-contain object-center"
          />
        </div>

        <div className="w-screen h-screen z-50 relative select-all pointer-events-auto">
          <div className="bottom-[18%] left-1/2 -translate-x-1/2 absolute flex gap-4">
            <MetallicButton onClick={() => router.push("/register")}>
              Register
            </MetallicButton>
            <MetallicButton
              variant={"ghost"}
              onClick={() => router.push("/explore")}
              className="bg-black/70 text-white"
            >
              Explore
            </MetallicButton>
          </div>
        </div>
      </section>
    </>
  );
};
