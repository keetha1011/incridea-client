import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import Parallax from "parallax-js";
import { type FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BsFillSuitHeartFill } from "react-icons/bs";

import Button from "~/components/button";
import ArcadeLoader from "~/components/loader/arcadeLoader";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

export default function Landing() {
  const router = useRouter();

  return (
    <main className="relative h-screen overflow-hidden">
      {typeof window !== "undefined" && (
        <>
          {window.sessionStorage.getItem("arcadeLoader") ? null : (
            <ArcadeLoader />
          )}
        </>
      )}
      <div className="absolute top-0">
        <HomeUi />
        <Menu router={router} />
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

  useLayoutEffect(() => {
    if (sceneRef.current)
      new Parallax(sceneRef.current, {
        relativeInput: true,
      });
  });

  const Logo = useRef(null);

  useGSAP(() => {
    if (!Logo.current) return;

    gsap.from(Logo.current, {
      delay: 0,
      duration: 0,
      scale: 3,
      opacity: 0.6,
      zIndex: 9999,
    });

    gsap.to(Logo.current, {
      duration: 2,
      scale: 1,
      opacity: 1,
    });
  });

  return (
    <>
      {/* <CountDown /> */}
      <section
        ref={sceneRef}
        className="relative min-h-screen bg-gradient-to-b from-[#00002a] via-[#1c23bb] to-pink-800/50"
      >
        <div className="absolute h-screen w-screen">
          <div id="foglayer_01" className="fog">
            <div className="image01" />
            <div className="image02" />
          </div>
          <div id="foglayer_02" className="fog">
            <div className="image01" />
            <div className="image02" />
          </div>
          <div id="foglayer_03" className="fog">
            <div className="image01" />
            <div className="image02" />
          </div>
        </div>

        <div data-depth="0.5" className="absolute h-screen w-screen">
          <div className="absolute bottom-0 left-[50%] aspect-video h-[75vh] -translate-x-1/2 translate-y-16 opacity-50 md:left-0 md:h-full md:w-full md:translate-x-0">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/moon.png`}
              alt="Gradient"
              width={1920}
              height={1080}
              className="h-full w-full object-contain object-bottom"
            />
          </div>
        </div>
        <div data-depth="0.4" className="absolute h-screen w-screen">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/stars.png`}
            alt="Gradient"
            width={1920}
            height={1080}
            className="absolute h-full w-full object-cover object-center"
          />
        </div>

        <div data-depth="0.3" className="absolute h-screen w-screen">
          <div className="absolute bottom-0 right-0 aspect-video h-full translate-x-[18%] translate-y-[3%] sm:translate-x-[12%] md:translate-x-[10%] lg:translate-x-[4%]">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/portal.png`}
              alt="Portal"
              width={2050}
              height={1080}
              className="h-full w-full object-cover object-right-bottom"
            />
          </div>
        </div>
        <div
          data-depth="0.2"
          className="absolute flex h-screen w-screen items-center justify-center"
        >
          <div className="mx-auto mt-[3%] w-fit p-5" ref={Logo}>
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/DoD.png`}
              width={640}
              height={640}
              alt="Dice of Destiny"
              className="h-fit w-full max-w-xl object-contain object-center"
            />
          </div>
        </div>
        <div data-depth="0.1" className="absolute h-screen w-screen">
          <div className="absolute bottom-0 left-0 aspect-video h-full -translate-x-[20%] translate-y-[3%] sm:-translate-x-[18%] md:-translate-x-[12%] lg:-translate-x-[10%]">
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/ryoko.png`}
              id="Ryoko"
              alt="Ryoko looking at portal"
              width={1920}
              height={1080}
              className="h-full w-full object-cover object-left-bottom"
            />
          </div>
        </div>
      </section>
    </>
  );
};
