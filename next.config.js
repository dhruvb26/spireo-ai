/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  ignoreBuildErrors: true,
  images: {
    domains: [
      "cdn.sanity.io",
      "images.unsplash.com",
      "res.cloudinary.com",
      "cdn.pixabay.com",
    ],
  },
};

export default config;
