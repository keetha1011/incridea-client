import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import Parallax from "parallax-js";
import { useLayoutEffect, useEffect, useRef } from "react";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
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
  const sceneRef = useRef<HTMLElement>(null);
  const largeClockRef = useRef(null);
  const smallClockRef = useRef(null);
  const floatingObjectsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      <section
        ref={sceneRef}
        className="relative min-h-screen bg-cover z-0 right-32 scale-[120%] select-none pointer-events-none"
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
        <div
          data-depth="0.1"
          className="absolute flex h-screen w-screen items-center justify-center z-20"
        >
          <div className="mx-auto w-screen h-screen p-5 relative">
            <Image
              src={`/2025/logo.png`}
              priority
              width={640}
              height={640}
              alt="Incridea Logo"
              className="absolute md:w-[15%] left-1/2 -translate-x-1/2 top-[20%] w-[45%] object-contain object-center"
            />
          </div>
        </div>
        <div data-depth="0.1" className="absolute w-screen h-screen z-20">
          <Image
            src={`/2025/eoelogo.png`}
            priority
            width={640}
            height={640}
            alt="EOE Logo"
            className="md:w-[30%] w-[85%] left-1/2 absolute -translate-x-1/2 md:top-[30%] top-[30%] object-contain object-center"
          />
        </div>
      </section>
    </>
  );
};

const Menu: React.FunctionComponent<{
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  router: NextRouter;
}> = ({ setShowModal }) => {
  const navItems = [
    { href: "/events", target: "Events" },
    { href: "/pronites", target: "Pronite" },
    { href: "/gallery", target: "Gallery" },
    { href: "/about", target: "About" },
    { href: "/sponsors", target: "Sponsors" },
  ];

  const { user, loading } = useAuth();

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
