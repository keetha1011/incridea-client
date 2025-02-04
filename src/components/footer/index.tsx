// @refresh reset
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsFillSuitHeartFill, BsInstagram } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";

import { env } from "~/env";

export function HomePageFooter() {
  const { RiveComponent } = useRive({
    src: `assets/rive/footer.riv/`,
    stateMachines: ["State Machine 1"],
    autoplay: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.BottomCenter,
    }),
  });
  return (
    <div>
      <RiveComponent className="h-[50vh] w-screen lg:h-screen" />
      <FooterBody />
    </div>
  );
}

export function FooterBody() {
  return (
    <div
      id="footer"
      style={{ willChange: "transform" }}
      className={`bodyFont relative snap-start`}
    >
      <div className="-mt-1 flex flex-col items-center justify-between gap-5 bg-primary-700 p-5 text-gray-100 md:flex-row">
        <div className="md:basis-1/5">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo-black.png`}
            width={150}
            height={100}
            alt="Incridea Logo"
            className="h-auto w-auto"
          />
        </div>
        <div className="md:basis-3/5">
          <ul className="flex flex-1 flex-row flex-wrap items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-sm md:gap-5">
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
            <li className="text-gray-300 hover:text-gray-100">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="md:basis-1/5">
          <ul className="flex flex-1 items-center justify-center gap-4 text-2xl">
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <a
                target="_blank"
                href="https://www.instagram.com/incridea/"
                rel="noreferrer"
              >
                <BsInstagram />
              </a>
            </li>
            <li className="text-white transition-colors duration-300 hover:text-gray-300">
              <a
                target="_blank"
                className="text-3xl"
                href="https://www.youtube.com/@incrideanmamit"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-primary-800">
        <p className="p-5 text-center text-sm text-gray-200">
          <Link
            className="flex items-center justify-center tracking-normal transition-all duration-300 hover:tracking-widest hover:text-gray-300"
            href="/team"
          >
            Made with <BsFillSuitHeartFill className="mx-2" /> by Technical Team
          </Link>
          <span className="mt-1 block font-semibold">© Incridea 2024</span>
        </p>
      </div>
    </div>
  );
}

export default function Footer() {
  const router = useRouter();
  if (router.pathname === "/") return null;
  if (router.pathname === "/gallery") return null;
  if (router.pathname === "/pronites") return null;
  if (router.pathname.startsWith("/event/")) return null;
  if (router.pathname === "/explore/spear/play") return null;
  return <FooterBody />;
}
