import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Config options here
experimental: {
  serverActions: {},
},

  images: {
    domains: ["res.cloudinary.com"], // ✅ Cloudinary allowed
  },
 
};

export default nextConfig;
