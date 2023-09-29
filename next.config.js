/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true, appDir: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
