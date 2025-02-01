import { ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useRef } from "react";
import { Toaster } from "react-hot-toast";
import LocalFont from "next/font/local";
import { Press_Start_2P } from "next/font/google";
import Footer from "~/components/footer";
import HeadComponent from "~/components/head";
import LoadingScreen from "~/components/loader";
import { useApollo } from "~/lib/apollo";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

const Navbar = dynamic(() => import("~/components/navbar"), { ssr: false });

const LOADING_DELAY = 300; 
const SLOW_SPEED_THRESHOLD = 0.5; 
const SPEED_TEST_INTERVAL = 10000;
export const VikingHell = LocalFont({
  src: "../font/Viking Hell.otf",
  variable: "--font-viking-hell",
});

export const garetFont = LocalFont({
  src: "../font/Garet-Book.otf",
  variable: "--font-Garet",
});

export const PTSerif = LocalFont({
  src: "../font/PTSerif-Regular.ttf",
  variable: "--font-PTSerif",
});

export const gilroy = LocalFont({
  src: [
    {
      path: "../font/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../font/Gilroy-SemiBold.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

export const pressStart = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  variable: "--font-Press_Start_2P",
});

export const BlackChancery = LocalFont({
  src: "../font/BlackChancery.ttf",
  variable: "--font-BlackChancery",
});
export default function App({
  Component,
  pageProps: { session: _session, ...pageProps },
  initialApolloState,
}: AppProps & { initialApolloState?: NormalizedCacheObject }) {
  const router = useRouter();
  const apolloClient = useApollo(initialApolloState);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const speedTestInterval = useRef<NodeJS.Timeout>();

  const measureConnectionSpeed = useCallback(async () => {
    try {
      const startTime = performance.now();
      const response = await fetch("/api/ping", {
        method: "HEAD",
        cache: "no-cache",
      });
      const endTime = performance.now();

      if (!response.ok) return;

      const duration = endTime - startTime;
      const speed = 1000 / duration; 

      setIsSlowConnection(speed < SLOW_SPEED_THRESHOLD);
    } catch (err) {
      console.log(err);
      setIsSlowConnection(true);
    }
  }, []);

  useEffect(() => {
    measureConnectionSpeed().catch((err) => console.log(err));

    speedTestInterval.current = setInterval(() => {
      measureConnectionSpeed().catch((err) => console.log(err));
    }, SPEED_TEST_INTERVAL);

    return () => {
      if (speedTestInterval.current) {
        clearInterval(speedTestInterval.current);
      }
    };
  }, [measureConnectionSpeed]);

  const handleLoadingStart = useCallback(() => {
    setIsLoading(true);

    if (isSlowConnection) {
      setShouldShowLoading(true);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setShouldShowLoading(true);
      }
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, [isLoading, isSlowConnection]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setShouldShowLoading(false);
  }, []);

  useEffect(() => {
    const handleSlowLoading = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        if (loadTime > 2000) {
          setShouldShowLoading(true);
        }
      }
    };

    window.addEventListener("load", handleSlowLoading);

    return () => {
      window.removeEventListener("load", handleSlowLoading);
    };
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleLoadingStart);
    router.events.on("routeChangeComplete", handleLoadingComplete);
    router.events.on("routeChangeError", handleLoadingComplete);

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 3000) {
          setShouldShowLoading(true);
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => {
      router.events.off("routeChangeStart", handleLoadingStart);
      router.events.off("routeChangeComplete", handleLoadingComplete);
      router.events.off("routeChangeError", handleLoadingComplete);
      observer.disconnect();
    };
  }, [router, handleLoadingStart, handleLoadingComplete]);

  const shouldRenderNavbar =
    router.pathname !== "/" &&
    !router.pathname.startsWith("/explore") &&
    !router.pathname.startsWith("/theme");

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShowLoading && <LoadingScreen />}
      </AnimatePresence>

      <ApolloProvider client={apolloClient}>
        <HeadComponent
          title="Incridea"
          description="Official Website of Incridea 2024, National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."
        />
        <Toaster />
        <div className={cn("min-h-screen bg-[#7528cf]")}>
          {shouldRenderNavbar && <Navbar />}
          <AnimatePresence mode="wait">
            <Component key={router.pathname} {...pageProps} />
          </AnimatePresence>
          <Footer />
        </div>
      </ApolloProvider>
      <Analytics />
    </>
  );
}
