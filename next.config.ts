/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remover a opção que não é reconhecida nesta versão
  experimental: {
    // Oxide já não é mais um problema no Next.js 15+
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
    // Configurações para melhorar a compatibilidade do Sharp
    formats: ['image/avif', 'image/webp'],
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
  // Ainda mantemos as variáveis de ambiente para o Sharp
  env: {
    SHARP_IGNORE_GLOBAL_LIBVIPS: '1'
  }
};

module.exports = nextConfig;
