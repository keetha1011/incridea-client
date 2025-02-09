import React, { useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import gsap from "gsap";

interface HomeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export default function HomeButton({
  className,
  children,
  ...props
}: HomeButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shine = shineRef.current;

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      shine,
      {
        x: "-100%",
      },
      {
        x: "100%",
        duration: 0.5,
        ease: "power1.inOut",
      },
    );

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mouseenter", () => {
        tl.play(0);
      });
    }
    if (button) {
      button.removeEventListener("mouseenter", function () {
        tl.play(0);
      });
    }
    return () => {
      button?.removeEventListener("mouseenter", function () {
        tl.play(0);
      });
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      {...props}
      className={cn(
        "flex w-full hover:scale-110 transition-all duration-300 border-2 text-lg md:text-2xl border-secondary-600 items-center h-14 px-10 justify-center gap-2 rounded-full bg-gradient-to-br from-[#186C16] to-[#186C16] via-primary-950 py-1 text-left tracking-wider relative overflow-hidden",
        className,
      )}
    >
      {children}
      <div
        ref={shineRef}
        className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
        style={{ pointerEvents: "none" }}
      />
    </button>
  );
}
