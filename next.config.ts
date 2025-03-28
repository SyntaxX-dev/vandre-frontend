/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suas configurações existentes
  
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
