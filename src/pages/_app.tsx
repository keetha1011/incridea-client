import { ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "react-hot-toast";

import Footer from "~/components/footer";
import HeadComponent from "~/components/head";
import LoadingScreen from "~/components/loader";
import { useApollo } from "~/lib/apollo";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

const Navbar = dynamic(() => import("~/components/navbar"), { ssr: false });

export default function App({
  Component,
  pageProps: { session: _session, ...pageProps },
  initialApolloState,
}: AppProps & { initialApolloState?: NormalizedCacheObject }) {
  const router = useRouter();
  const apolloClient = useApollo(initialApolloState);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);

  const handleRouteChangeStart = useCallback((url: string) => {
    const isHomePage = url === '/';
    const isFirstVisit = !visitedPages.includes(url);
    
    if (!isHomePage && isFirstVisit) {
      setIsTransitioning(true);
      setVisitedPages(prev => [...prev, url]);
    }
  }, [visitedPages]);

  const handleRouteChangeComplete = useCallback(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", () => setIsTransitioning(false));

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", () => setIsTransitioning(false));
    };
  }, [router, handleRouteChangeStart, handleRouteChangeComplete]);

  const shouldRenderNavbar =
    router.pathname !== "/" &&
    !router.pathname.startsWith("/explore") &&
    !router.pathname.startsWith("/theme");

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <LoadingScreen />
        )}
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