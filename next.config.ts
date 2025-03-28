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
  // Downgrade from the SWC minifier to terser
  swcMinify: false
};

module.exports = nextConfig;
