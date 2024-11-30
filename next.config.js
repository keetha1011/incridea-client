// TODO(Omkar): Add PWA support
// import PWA from "next-pwa";
// const withPWA = PWA({
//   dest: "public",
//   disable: env.NODE_ENV === "development",
// });

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
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
    ],
  },
};

export default config;
