import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import Parallax from "parallax-js";
import { type FC, useEffect, useRef, useState } from "react";
import { BsFillSuitHeartFill } from "react-icons/bs";

import Button from "~/components/button";
import ArcadeLoader from "~/components/loader/arcadeLoader";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      {/* {typeof window !== "undefined" && (
        <>
          {window.sessionStorage.getItem("arcadeLoader") ? null : (
            <ArcadeLoader />
          )}
        </>
      )} */}
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
    <footer className="absolute bottom-0 flex w-full flex-col gap-2 text-gray-200 md:gap-4  pt-4">
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
              src={"/assets/landing/background.jpg"}
              priority
              alt="Gradient"
              width={1920}
              height={1080}
              className="h-full w-full object-cover md:scale-100 scale-[110%] mt-12"
            />
          </div>
        </div>

        <div data-depth="0.4" className="absolute h-screen w-screen">
          <div className="relative mx-auto w-fit h-fit my-auto p-5 md:mt-24 mt-28">
            <Image
              src={`/assets/landing/clock.png`}
              priority
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="absolute h-fit w-full max-w-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain object-center md:scale-[75%] scale-[45%]"
              ref={largeClockRef}
            />
            <Image
              src={`/assets/landing/clock.png`}
              priority
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="relative h-fit w-full max-w-xl object-contain object-center md:scale-[55%] scale-[25%]"
              ref={smallClockRef}
            />
          </div>
        </div>

        <div className="absolute h-screen w-screen">
          <div className="w-full h-full relative">
            <Image
              src={"/assets/landing/pillar.png"}
              priority
              alt="Gradient"
              width={1920}
              height={1080}
              className="md:h-[50rem] h-[35rem] absolute bottom-0 left-1/2 -translate-x-1/2 mt-auto w-full md:object-fill object-cover object-center"
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
                src={`/assets/landing/floatingObjects/${item}.png`}
                priority
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
          data-depth="0.1"
          className="absolute flex h-screen w-screen items-center justify-center z-20"
        >
          <div className="mx-auto w-fit p-5 relative">
            <Image
              src={`/assets/landing/incridea.png`}
              priority
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full scale-[50%] max-w-xl object-contain object-center md:translate-y-[90%] translate-y-[130%]"
            />
          </div>
        </div>

        <div
          data-depth="0.1"
          className="absolute flex h-screen w-screen items-center justify-center z-20"
        >
          <div className="mx-auto w-fit p-5 relative">
            <Image
              src={`/assets/landing/EOEText.png`}
              priority
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full max-w-xl object-contain object-center md:translate-y-[161%] translate-y-[196%]"
            />
          </div>
        </div>

        <div
          data-depth="0.05"
          className="absolute flex h-screen w-screen items-center justify-center pointer-events-none"
        >
          <div className="mx-auto w-fit p-5 relative">
            <Image
              src={`/assets/landing/EOEShadow.png`}
              priority
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full max-w-xl object-contain object-center z-0 md:translate-y-[160%] translate-y-[195%]  opacity-85 blur-sm"
            />
          </div>
        </div>
      </section>
    </>
  );
};
