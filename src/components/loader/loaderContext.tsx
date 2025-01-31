import React, { createContext, useEffect, useState } from "react";
import BlackHoleLoader from "./blackholeLoader";
import gsap from "gsap";
import { useRouter } from "next/router";

type LoaderContextType = {
  show: "loading" | "show" | "hide";
  animateOverlay: boolean;
  setShow: (value: "loading" | "show" | "hide") => void;
  setAnimate: (value: boolean) => void;
};

export const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState<"loading" | "show" | "hide">(
    "show",
  );
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      if (window.sessionStorage.getItem("black-hole-loader") === "true") {
        gsap.set("#black-hole-overlay", {
          display: "none",
        });
        setShowLoader("hide");
      } else {
        if (router.pathname !== "/") {
          setShowLoader("hide");
        } else {
          setShowLoader("show");
        }
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    if (router.pathname !== "/") {
      gsap.set("#black-hole-overlay", { display: "none" });
      return;
    }
    if (showLoader === "hide" && animate) {
      gsap.fromTo(
        "#black-hole-overlay",
        {
          display: "fixed",
          opacity: 1,
          delay: 0,
          backgroundColor: "black",
        },
        {
          opacity: 0,
          backgroundColor: "rgb(0,44,77)",
          duration: 2,
          display: "none",
        },
      );
    }
  }, [showLoader, animate]);

  return (
    <>
      <div
        className="w-screen h-screen bg-black fixed top-0 left-0 z-[999999]"
        id="black-hole-overlay"
      ></div>
      {showLoader === "hide" ? (
        <>{children}</>
      ) : showLoader === "show" ? (
        <LoaderContext.Provider
          value={{
            show: showLoader,
            animateOverlay: false,
            setShow: setShowLoader,
            setAnimate: setAnimate,
          }}
        >
          <BlackHoleLoader />
        </LoaderContext.Provider>
      ) : null}{" "}
      {/** null */}
    </>
  );
}
