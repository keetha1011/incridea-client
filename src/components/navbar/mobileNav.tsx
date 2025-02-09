import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLerpRef } from "~/hooks/use-lerp-ref";
import { useTimeline } from "~/hooks/use-timeline";
import { useTrackDragInertia } from "~/hooks/use-track-drag";
import { useWheel } from "~/hooks/use-wheel";
import { mod } from "~/lib/math";
import Image from "next/image";
import Link from "next/link";

interface NavItemProps {
  active: boolean;
  label: string;
  href: string;
}

const links: {
  label: string;
  href: string;
}[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore",
    href: "/explore",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Sponsors",
    href: "/sponsors",
  },
  {
    label: "Pronites",
    href: "/pronites",
  },
  {
    label: "About",
    href: "/about",
  },
];
const REPS = 6;
const DISPLAY_LINKS_LENGTH = links.length * REPS;
const TWO_PI = Math.PI * 2;

const NavItem: React.FC<NavItemProps> = ({ active, label, href }) => {
  const itemRef = useRef<HTMLLIElement>(null);

  const inTimeline = useTimeline(() => {
    const selector = gsap.utils.selector(itemRef.current);
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(selector("#item-arrow-wrapper"), {
      opacity: 1,
      x: -25,
    })
      .set(selector("#item-arrow"), {
        opacity: 0,
        x: -20,
        scale: 1,
        rotate: 0,
      })
      .set(selector("#item-border"), {
        scale: 0.8,
        rotateX: 120,
        rotateY: 90,
        force3D: true,
        transformPerspective: 600,
        opacity: 0,
      })
      .to(
        selector("#item-arrow-wrapper"),
        {
          x: 0,
          duration: 0.9,
        },
        "<",
      )
      .to(
        selector("#item-border"),
        {
          duration: 0.8,
          scale: 1,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
        },
        "<",
      )
      .to(
        selector("#item-arrow"),
        {
          opacity: 1,
          ease: "back.out(2)",
          x: 0,
        },
        ">",
      );

    return tl;
  }, []);

  const outTimeline = useTimeline(() => {
    const selector = gsap.utils.selector(itemRef.current);
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(selector("#item-border"), {
      duration: 0.5,
      scale: 0.8,
      opacity: 0,
    })
      .to(
        selector("#item-arrow"),
        {
          duration: 0.5,
          opacity: 0,
          scale: 0.8,
          rotate: -180,
          ease: "back.in(2)",
        },
        "<",
      )
      .set(selector("#item-arrow-wrapper"), {
        opacity: 0,
      });

    return tl;
  }, []);

  useEffect(() => {
    if (active) {
      outTimeline?.pause();
      inTimeline?.invalidate();
      inTimeline?.restart();
    } else {
      inTimeline?.pause();
      outTimeline?.invalidate();
      outTimeline?.restart();
    }
  }, [active, inTimeline, outTimeline]);

  return (
    <li
      className="absolute group font-life-craft left-1/2 top-1/2 origin-left nav-item text-em-[54/16] pointer-events-auto"
      ref={itemRef}
    >
      <a href={href}>
        <div className="flex items-center gap-x-4">
          <span className="sm:text-6xl text-5xl text-white">{label}</span>

          <div
            id="item-arrow-wrapper"
            className="relative p-2.5 opacity-0 rounded-full overflow-hidden"
          >
            <span
              id="item-border"
              className="absolute top-0 left-0 w-full h-full"
            >
              <svg width="100%" viewBox="0 0 25 25">
                <circle
                  cx={12.5}
                  cy={12.5}
                  r={12}
                  fill="none"
                  className="stroke-zinc-800"
                  strokeWidth={1}
                />
                <circle
                  cx={12.5}
                  cy={12.5}
                  r={12}
                  fill="none"
                  strokeWidth="1px"
                  stroke="white"
                  style={
                    {
                      "--dash-array": TWO_PI * 12,
                    } as React.CSSProperties
                  }
                  strokeDasharray="var(--dash-array)"
                  strokeDashoffset="var(--dash-array)"
                  className="group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-500 ease-in-out"
                />
              </svg>
            </span>

            <div id="item-arrow" className="relative">
              <svg
                width="32"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-[opacity_transform] duration-500 ease-in-out translate-x-0 opacity-100 group-hover:opacity-0 group-hover:translate-x-full"
              >
                <path
                  d="M20.5 12.5H4.5M20.5 12.5L13.5 5.5M20.5 12.5L13.5 19.5"
                  stroke="white"
                  strokeWidth={1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className="absolute inline-block top-0 left-0 transition-[opacity_transform] duration-500 ease-in-out -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                width="32"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5 12.5H4.5M20.5 12.5L13.5 5.5M20.5 12.5L13.5 19.5"
                  stroke="white"
                  strokeWidth={1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};

const MobileNav: React.FC = () => {
  const radius = 700;
  const factorX = 0.8;
  const factorY = 1;
  const translateX = -85;
  const posX = 0;
  const stepFactor = 1;

  const ANGLE_STEP = (360 / DISPLAY_LINKS_LENGTH) * stepFactor;
  const ANGLE_STEP_RAD = ANGLE_STEP * (Math.PI / 180);
  const INITIAL_OFFSET = -Math.PI / 2 + ANGLE_STEP_RAD;

  const getActiveAngularStep = useCallback(
    (radOffset: number) => {
      return (
        Math.round(mod(radOffset, 2 * Math.PI) / ANGLE_STEP_RAD) %
        DISPLAY_LINKS_LENGTH
      );
    },
    [ANGLE_STEP_RAD],
  );

  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasInteracted = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const radOffset = useLerpRef(INITIAL_OFFSET, {
    lerp: 0.24,
    onTick: () => {
      if (!isClient) return;

      const _radOffset = radOffset.current.current;
      const items = document.querySelectorAll("#wheel > .nav-item");

      items.forEach((item, idx) => {
        if (item instanceof HTMLElement) {
          const { style } = getItemProps(idx, _radOffset);
          item.style.transform = style.transform;
        }
      });

      setActiveIndex(getActiveAngularStep(_radOffset));
    },
  });

  const handleMenuClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const { listeners } = useTrackDragInertia({
    onMotion: ({ deltaY }: { deltaY: number }) => {
      radOffset.target.current = radOffset.target.current + deltaY / 200;
      hasInteracted.current = true;
    },
    weight: 0.98,
  });

  useWheel(({ deltaY }: { deltaY: number }) => {
    if (!open) return;
    radOffset.target.current = radOffset.target.current + deltaY / 200;
    hasInteracted.current = true;
  });

  const openTimeline = useTimeline(() => {
    const tl = gsap.timeline({});
    tl.set("#wheel .nav-item", { opacity: 0 })
      .to(["#menu-icon"], { scale: 1.1, opacity: 0, duration: 0.75 }, 0)
      .set("#overlay", { display: "block" })
      .fromTo(
        ["#close-border", "#close-icon"],
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 },
      )
      .fromTo(
        "#wheel .nav-item",
        { display: "inline-block", x: -50 },
        { opacity: 1, x: 0, duration: 0.6, stagger: { each: 0.06 } },
        "<",
      );
    return tl;
  }, [links.length, isClient]);

  const closeTimeline = useTimeline(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      "#close-border",
      { scale: 1 },
      { scale: 0.9, duration: 0.6, opacity: 0 },
    )
      .fromTo(
        "#close-icon",
        { rotate: 0, opacity: 1 },
        {
          rotate: 180,
          opacity: 0,
          duration: 0.6,
          scale: 0.2,
          ease: "power3.in",
        },
        "<",
      )
      .to(
        "#wheel .nav-item",
        { x: -50, opacity: 0, ease: "power3.in", duration: 0.56 },
        "<",
      )
      .set("#overlay", { display: "none" })
      .to(["#menu-icon"], { scale: 1, opacity: 1, duration: 0.6 });
    return tl;
  }, [isClient]);

  useEffect(() => {
    if (open) {
      hasInteracted.current = false;
      radOffset.target.current = INITIAL_OFFSET;
      closeTimeline?.pause();
      openTimeline?.invalidate();
      openTimeline?.restart();
    } else if (!open) {
      openTimeline?.pause();
      closeTimeline?.invalidate();
      closeTimeline?.restart();
    }
  }, [open, openTimeline, closeTimeline, INITIAL_OFFSET, radOffset]);

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      const prevOverscrollBehavior = html.style.overscrollBehavior;
      html.style.overscrollBehavior = "none";
      return () => {
        html.style.overscrollBehavior = prevOverscrollBehavior;
      };
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const getItemProps = useCallback(
    (idx: number, _radOffset: number = INITIAL_OFFSET) => {
      const anglePos = ANGLE_STEP * idx;
      const anglePosRad = anglePos * (Math.PI / 180);
      const x = radius * Math.cos(anglePosRad + _radOffset);
      const y = radius * Math.sin(anglePosRad + _radOffset);
      const rotate = Math.atan2(y * factorX, x * factorY) * (180 / Math.PI);

      return {
        x,
        y,
        rotate,
        style: {
          transform: `translateX(calc(${
            x * factorX
          }px)) translateY(calc(-50% + ${y * factorY}px)) rotate(${rotate}deg)`,
        },
      };
    },
    [ANGLE_STEP, INITIAL_OFFSET, factorX, factorY, radius],
  );

  return (
    <>
      <nav
        style={{
          clipPath:
            "polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)",
        }}
        className="fixed w-screen top-4 bg-white/10 backdrop-blur-2xl h-16 flex md:hidden justify-between items-center px-6 z-40"
      >
        <Link href="/">
          {isClient && (
            <Image
              className="w-24 transition-opacity hover:opacity-75"
              src={`/2025/logo.png`}
              alt="Logo"
              width={100}
              height={80}
              priority
            />
          )}
        </Link>
        <button id="menu" onClick={handleMenuClick} className="p-3.5">
          <svg
            id="menu-icon"
            width="32"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="12" width="17" height="1" fill="white" />
            <rect x="4" y="7" width="17" height="1" fill="white" />
            <rect x="4" y="17" width="17" height="1" fill="white" />
          </svg>
        </button>
      </nav>
      {isClient && (
        <div
          id="overlay"
          {...(listeners as unknown as React.HTMLAttributes<HTMLDivElement>)}
          onMouseDown={(e) => {
            //@ts-expect-error ignore
            listeners.onMouseDown(e);
          }}
          onTouchStart={(e) => {
            //@ts-expect-error ignore
            listeners.onTouchStart(e);
          }}
          style={{
            display: "none",
            background:
              "radial-gradient(circle at -50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 100%)",
            position: "fixed",
          }}
          className="fixed z-[9999999] w-full h-[100svh]"
        >
          <div className="relative w-full h-full">
            {" "}
            {/* Add this wrapper */}
            <ul
              id="wheel"
              style={{
                transform: `translateX(${translateX}%) translateY(-50%)`,
                top: "50%",
                left: posX + "%",
                width: radius * 2 + "px",
                height: radius * 2 + "px",
                pointerEvents: "none",
                position: "absolute", // Add this
              }}
              className="rounded-full bg-[transparent]"
            >
              {Array.from({ length: REPS })
                .flatMap(() => links)
                .map((link: { label: string; href: string }, idx, arr) => {
                  return (
                    <NavItem
                      active={
                        (arr.length - activeIndex) % arr.length === idx && open
                      }
                      key={link.label + idx}
                      label={link.label}
                      href={link.href}
                    />
                  );
                })}
            </ul>
            <button
              id="close"
              onClick={() => setOpen((v) => !v)}
              className="absolute z-10 p-3.5 max-lg:bottom-8 lg:-translate-x-1/2 max-lg:right-8 lg:left-1/2 lg:top-1/2 max-w-max lg:-translate-y-1/2"
            >
              <span
                id="close-border"
                className="absolute top-0 left-0 w-full h-full border-2 rounded-full border-zinc-800"
              />
              <svg
                id="close-icon"
                width="32"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6.13672"
                  y="18.1572"
                  width="17"
                  height="1"
                  transform="rotate(-45 6.13672 18.1572)"
                  fill="white"
                />
                <rect
                  x="6.84375"
                  y="6.13672"
                  width="17"
                  height="1"
                  transform="rotate(45 6.84375 6.13672)"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
