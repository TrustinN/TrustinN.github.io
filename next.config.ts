import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};
// && mv out/_next out/next && sed -i '' -e 's/\\/_next/\\.\\/next/g' out/**.html

export default nextConfig;
