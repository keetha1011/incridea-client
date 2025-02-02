import { ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import LocalFont from "next/font/local";
import { Press_Start_2P } from "next/font/google";
import Footer from "~/components/footer";
import HeadComponent from "~/components/head";
import LoadingScreen from "~/components/loader";
import { useApollo } from "~/lib/apollo";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import BackGroundGradient from "~/components/layout/background";

const Navbar = dynamic(() => import("~/components/navbar"), { ssr: false });

// Font definitions
export const VikingHell = LocalFont({
  src: "../font/Viking Hell.otf",
  variable: "--font-viking-hell",
});

export const garetFont = LocalFont({
  src: "../font/Garet-Book.otf",
  variable: "--font-Garet",
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
  const loadingTimeout = useRef<NodeJS.Timeout>();

  const handleLoadingStart = useCallback(() => {
    // Clear any existing timeout
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }

    // Only show loading screen if loading takes more than 300ms
    loadingTimeout.current = setTimeout(() => {
      setIsLoading(true);
    }, 300);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    // Clear the timeout to prevent showing loader after completion
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleLoadingStart);
    router.events.on("routeChangeComplete", handleLoadingComplete);
    router.events.on("routeChangeError", handleLoadingComplete);

    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      router.events.off("routeChangeStart", handleLoadingStart);
      router.events.off("routeChangeComplete", handleLoadingComplete);
      router.events.off("routeChangeError", handleLoadingComplete);
    };
  }, [router, handleLoadingStart, handleLoadingComplete]);

  const shouldRenderNavbar =
    router.pathname !== "/" &&
    !router.pathname.startsWith("/explore") &&
    !router.pathname.startsWith("/theme");

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <ApolloProvider client={apolloClient}>
        <HeadComponent
          title="Incridea"
          description="Official Website of Incridea 2024, National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."
        />
        <BackGroundGradient>
          <Toaster />
          <div className={cn("min-h-screen]")}>
            {shouldRenderNavbar && <Navbar />}
            <AnimatePresence mode="wait">
              <Component key={router.pathname} {...pageProps} />
            </AnimatePresence>
            <Footer />
          </div>
        </BackGroundGradient>
      </ApolloProvider>
      <Analytics />
    </>
  );
}
