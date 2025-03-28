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
  // Add this to help with the Tailwind CSS Oxide error
  experimental: {
    // This will disable the new Rust compiler which is causing issues
    disableExperimentalRsc: true
  }
};

module.exports = nextConfig;
