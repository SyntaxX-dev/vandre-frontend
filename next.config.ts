/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    disableExperimentalTailwindcssCompiler: true
  },
  images: {
    domains: ['vandre-backend.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vandre-backend.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/travel-packages',
        destination: 'https://vandre-backend.vercel.app/api/travel-packages',
      },
      {
        source: '/travel-packages/:path*',
        destination: 'https://vandre-backend.vercel.app/travel-packages/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
