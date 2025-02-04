import { Html, Plane, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Link from "next/link";
import { useRef, useState } from "react";

import styles from "./annotation.module.css";

export default function ProniteAnnotation() {
  const scroll = useScroll();
  const [scrollData, setScrollData] = useState(false);
  const scrollChangeFlag = useRef(false);

  useFrame(() => {
    if (scrollChangeFlag.current !== scroll.visible(0.22, 0.435)) {
      scrollChangeFlag.current = !scrollChangeFlag.current;
      setScrollData(scrollChangeFlag.current);
    }
  });

  return (
    <group rotation={[0, -Math.PI / 2, 0]} position={[4, 1.2, 1]}>
      <Html
        transform
        occlude="blending"
        scale={[0.5, -0.5, 0.5]}
        rotation={[Math.PI, 0, 0]}
        zIndexRange={[0, 50]}
        geometry={
          <Plane args={[1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial color={"black"} transparent opacity={0} />
          </Plane>
        }
        center
        portal={{ current: scroll.fixed }}
      >
        <Link
          href="/pronites"
          className={styles.annotationContainer}
          onClick={() => {
            console.log("Clicked");
          }}
          target="_blank"
        >
          <div
            style={{
              opacity: scrollData ? 1 : 0,
              pointerEvents: scrollData ? "auto" : "none",
            }}
            className={styles.annotation}
          >
            Pronites
          </div>
        </Link>
      </Html>
    </group>
  );
}
