// TODO(Omkar): Add PWA support
// import PWA from "next-pwa";
// const withPWA = PWA({
//   dest: "public",
//   disable: env.NODE_ENV === "development",
// });

import { type NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env";

const config: NextConfig = {
  distDir: process.env.BUILD_DIR ?? ".next",

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "incridea.in",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      // {
      //   protocol: "https",
      //   hostname: "placehold.co",
      // },
    ],
  },

  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };
  //   return config;
  // },
};

export default config;
