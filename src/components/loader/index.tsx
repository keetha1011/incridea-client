import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";

import { env } from "~/env";

import styles from "./loader.module.css";

const Loader: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    function startTimer() {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          document.body.classList.remove("remove-scrolling");
        }, 10);
      }, 3000);
    }

    window.scrollTo(0, 0);
    router.events.on("routeChangeStart", () => {
      window.scrollTo(0, 0);
      document.body.classList.add("remove-scrolling");
      setIsLoading(true);
      setOpen(true);
    });

    router.events.on("routeChangeComplete", () => {
      startTimer();
    });

    router.events.on("routeChangeError", () => {
      startTimer();
    });

    return () => {
      setIsLoading(false);
      setOpen(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div
          className={`w-fh-full no-scrollbar absolute z-[9999] h-full overflow-hidden`}
        >
          <div
            className={`fixed h-screen w-screen bg-primary-300 ${styles.fadeInBg}`}
          >
            <Image
              className={`${
                open ? styles.mountbl : styles.unmountbl
              } absolute h-screen w-full object-cover object-center`}
              src={`/assets/loader/cloudbl.png`}
              alt="cloud-bg"
              height={1080}
              width={1920}
            />
            <Image
              className={`${
                open ? styles.mounttr : styles.unmounttr
              } absolute h-screen w-full object-cover object-center`}
              src={`/assets/loader/cloudtr.png`}
              alt="cloud-bg"
              height={1080}
              width={1920}
            />
            <div className="flex h-screen w-full flex-col items-center justify-center">
              <Image
                className={`${styles.fadeinlogo} h-auto w-44 animate-pulse`}
                src={`/assets/png/logo-black.png`}
                alt="logo"
                height={250}
                width={250}
              />
              <Image
                className={`${styles.fadeinlogo} h-auto w-auto animate-pulse`}
                src={`/assets/loader/dodLogo.png`}
                alt="logo"
                height={250}
                width={250}
              />
            </div>
            <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center px-4">
              <div className={`pointer-events-none ${styles.animateMagnifier}`}>
                <Image
                  src={`/assets/loader/magnifier.png`}
                  className="h-auto w-16"
                  height={100}
                  width={100}
                  alt="magnifier"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`no-scrollbar absolute h-full w-full overflow-hidden ${styles.fadeloader}`}
        >
          {/* FIXME: Dont know if fadeOutBg is working or not */}
          <div
            className={`fixed h-screen w-screen bg-primary-300 ${styles.fadeOutBg}`}
          >
            <Image
              className={`${styles.unmountblsecond} absolute h-screen w-screen object-cover object-center`}
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/loader/cloudbl.png`}
              alt="cloud-bg"
              height={1000}
              width={1000}
            />
            <Image
              className={`${styles.unmounttrsecond} absolute h-screen w-screen object-cover object-center`}
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/loader/cloudtr.png`}
              alt="cloud-bg"
              height={1000}
              width={1000}
            />
            <div
              className={`flex h-screen w-screen flex-col items-center justify-center`}
            >
              <Image
                className={`${styles.fadelogo} h-auto w-44`}
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo-black.png`}
                alt="logo"
                height={250}
                width={250}
              />
              <Image
                className={`${styles.fadelogo} h-auto w-auto`}
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/loader/dodLogo.png`}
                alt="logo"
                height={250}
                width={250}
              />
            </div>
            <div
              className={`${styles.fadelogo} absolute left-0 top-0 flex h-screen w-screen items-center justify-center`}
            >
              <div className={`pointer-events-none ${styles.animateMagnifier}`}>
                <Image
                  src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/loader/magnifier.png`}
                  className="h-auto w-16"
                  height={100}
                  width={100}
                  alt="magnifier"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
