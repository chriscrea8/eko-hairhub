/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  eslint: {
    // Don't fail production builds on ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail production builds on TypeScript errors
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
