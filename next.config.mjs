/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.lhr.life", "localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
