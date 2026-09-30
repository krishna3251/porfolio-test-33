/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [24, 32, 48, 64, 96, 128, 192, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
