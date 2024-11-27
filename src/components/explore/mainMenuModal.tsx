import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import Parallax from "parallax-js";
import { useLayoutEffect, useEffect, useRef } from "react";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const MainMenuModal: React.FunctionComponent<Props> = ({
  showModal,
  setShowModal,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (showModal) window.document.body.style.overflowY = "clip";
    else window.document.body.style.overflowY = "auto";
  }, [showModal]);

  return (
    <div
      style={{ display: showModal ? "initial" : "none" }}
      className="fixed inset-0 z-[9999] h-screen w-screen backdrop-blur-sm"
    >
      <div className="relative h-full w-full">
        <div className="absolute left-2/4 top-2/4 z-[9999] h-[85%] w-[85%] -translate-x-2/4 -translate-y-2/4 overflow-clip rounded-xl bg-blue-400">
          <HomeUi />
          <Menu
            router={router}
            setShowModal={setShowModal}
            showModal={showModal}
          />
          <HomeFooter />
        </div>
      </div>
    </div>
  );
};

export default MainMenuModal;

const HomeUi: React.FunctionComponent = () => {
  useLayoutEffect(() => {
    const scene = document.getElementById("scene") as HTMLElement;

    let parallaxInstance = new Parallax(scene, {
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
      <section
        id="scene"
        className="relative min-h-full bg-gradient-to-b from-[#00002a] via-[#1c23bb] to-pink-800/50"
      >
        <div className="absolute h-full w-full">
          <div id="foglayer_01" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
          <div id="foglayer_02" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
          <div id="foglayer_03" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
        </div>

        <div data-depth="0.5" className="absolute h-full w-full">
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
        <div data-depth="0.4" className="absolute h-full w-full">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/home/stars.png`}
            alt="Gradient"
            width={1920}
            height={1080}
            className="absolute h-full w-full object-cover object-center"
          />
        </div>

        <div data-depth="0.3" className="absolute h-full w-full">
          <div className="absolute bottom-0 right-0 aspect-video h-full translate-x-[18%] translate-y-[4.1%] sm:translate-x-[12%] md:translate-x-[10%] lg:translate-x-[4.1%]">
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
          className="absolute flex h-full w-full items-center justify-center"
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
        <div data-depth="0.1" className="absolute h-full w-full">
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

const Menu: React.FunctionComponent<{
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  router: NextRouter;
}> = ({ showModal, setShowModal, router }) => {
  const navItems = [
    { href: "/events", target: "Events" },
    { href: "/pronites", target: "Pronite" },
    { href: "/gallery", target: "Gallery" },
    { href: "/about", target: "About" },
    { href: "/sponsors", target: "Sponsors" },
  ];

  const { user, loading, error } = useAuth();

  return (
    <div className="absolute bottom-0 left-0 flex h-full w-full flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute bottom-10 my-24 hidden w-fit flex-col items-center gap-3 sm:flex-row md:gap-10 lg:flex">
        <Button
          className="h-fit w-40 px-4 sm:px-12"
          size={"large"}
          onClick={() => {
            setShowModal(false);
          }}
        >
          Resume
        </Button>
        <Link href="/">
          <Button
            intent={"ghost"}
            className="h-fit w-40 px-4 sm:px-12"
            size={"large"}
          >
            Exit
          </Button>
        </Link>
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

        <Button
          className="w-40 justify-center px-12 md:w-64 md:justify-end md:px-16 lg:hidden"
          size={"large"}
          onClick={() => {
            setShowModal(false);
          }}
        >
          Resume
        </Button>

        <Link
          href={loading ? "" : user ? "/profile" : "/login"}
          target="_blank"
        >
          <Button
            intent={"primary"}
            className="hidden w-40 justify-center px-12 md:w-64 md:justify-end md:px-16 lg:flex"
            size={"large"}
          >
            {loading ? (
              <Spinner size="small" className="py-[2px]" />
            ) : user ? (
              "Profile"
            ) : (
              "Register"
            )}
          </Button>
        </Link>
        {navItems.map((e, i) => (
          <Link key={i} href={e.href} target="_blank">
            <Button
              className="w-40 justify-center px-12 md:w-64 md:justify-end md:px-16"
              size={"large"}
            >
              {e.target}
            </Button>
          </Link>
        ))}
        {
          <>
            <Link
              href={loading ? "" : user ? "/profile" : "/login"}
              target="_blank"
            >
              <Button
                intent={"ghost"}
                className="block w-40 justify-center !bg-primary-800/70 px-12 md:w-64 md:justify-end md:px-16 lg:hidden"
                size={"large"}
              >
                {loading ? (
                  <Spinner size="small" className="py-[2px]" />
                ) : user ? (
                  "Profile"
                ) : (
                  "Register"
                )}
              </Button>
            </Link>
            <Link href="/">
              <Button
                intent={"ghost"}
                className="block w-40 justify-center !bg-primary-800/70 px-12 md:w-64 md:justify-end md:px-16 lg:hidden"
                size={"large"}
              >
                Exit
              </Button>
            </Link>
          </>
        }
      </div>
    </div>
  );
};

const HomeFooter = () => {
  return (
    <footer className="absolute bottom-0 w-full text-gray-200">
      <p className="p-5 text-center text-sm">© Incridea 2024</p>
    </footer>
  );
};
