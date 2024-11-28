// TODO(Omkar): Add PWA support
// import PWA from "next-pwa";
// const withPWA = PWA({
//   dest: "public",
//   disable: env.NODE_ENV === "development",
// });

import { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env";

const config: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "incridemo.web.app",
      },
    ],
  },
};

export default config;
