import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Config options here
  experimental: {
    serverActions: {
      external: true,
    },
     
  },
  //  images: {
  //   domains: ["images.unsplash.com", "picsum.photos"], // apne domain yaha daalo
  // },
  images: {
    domains: ["res.cloudinary.com"], // ✅ Cloudinary allowed
  },
 
};

export default nextConfig;
