import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires declaring every quality value used by next/image.
    qualities: [75, 85, 88, 90],
  },
};

export default nextConfig;
