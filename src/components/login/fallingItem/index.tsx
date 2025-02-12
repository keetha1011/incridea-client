import Image from "next/image";
import React, { type FunctionComponent, useEffect, useState } from "react";
import { CONSTANT } from "~/constants";

type Prop = {
  delay: number;
};

const elements: string[] = [
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
  "timestone.png",
] as const;

const getElement: () => number = () => {
  return Math.floor(Math.random() * 11);
};

const getSize: () => { width: number; height: number } = () => {
  const size = Math.floor(Math.random() * 40) + 40;
  return { width: size, height: size };
};

const getPosition: () => number = () => {
  return Math.floor(Math.random() * 80) + 10;
};

const FallingItem: FunctionComponent<Prop> = ({ delay }) => {
  const [src, setSrc] = useState(elements[getElement()]!);
  const [left, setLeft] = useState(getPosition());
  const [size, setSize] = useState(getSize());

  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        setSrc(elements[getElement()]!);
        setLeft(getPosition());
        setSize(getSize());
        // TODO: 100000 should be same as that in animation duration of free-fall in tailwind.config.js
      }, 10000);
    }, delay);
  }, [delay]);

  return (
    <div
      className={"pointer-events-none absolute animate-free-fall hue-rotate-0"}
      style={{
        animationDelay: `${delay}ms`,
        top: "0px",
        left: `${left}%`,
        width: `${size.width}`,
        height: `${size.height}`,
      }}
    >
      <Image
        src={`/${CONSTANT.YEAR}/leaderboard/${src}`}
        alt={src}
        width={size.width}
        height={size.height}
        style={{
          filter: `hue-rotate(${[0, 60, 90, 180][Math.floor(Math.random() * 7)]}deg)`,
        }}
      />
    </div>
  );
};

export default FallingItem;
