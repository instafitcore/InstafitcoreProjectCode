/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vvvjxzaqrxivvitrrsjr.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
