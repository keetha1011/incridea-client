import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BackGroundGradient({
  children,
}: {
  children?: React.ReactNode;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        {
          background:
            "linear-gradient(45deg, rgba(0,51,31,1) 10%, rgba(0,102,63,1) 20%, rgba(0,51,31,1) 90%)",
        },
        {
          background:
            "linear-gradient(45deg, rgba(0,51,31,1) 10%, rgba(0,102,63,1) 80%, rgba(0,51,31,1) 90%)",
          repeat: -1,
          yoyo: true,
          duration: 6,
          ease: "power1.inOut",
        },
      );
    }
  }, []);

  return (
    <div ref={bgRef} className="min-w-screen min-h-screen bg-[rgb(0,51,31)]">
      {children}
    </div>
  );
}
