/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization completely
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vandre-backend.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
