/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Manter a configuração para desativar o compilador Oxide
  experimental: {
    disableExperimentalTailwindcssCompiler: true
  },
  // Manter suas configurações de imagens existentes
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
    // Adicionar formatos para melhorar a compatibilidade com Sharp
    formats: ['image/avif', 'image/webp'],
    // Configurações para melhorar a compatibilidade do Sharp
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Manter suas configurações de rewrites
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
  // Adicionar variáveis de ambiente para resolver os problemas
  env: {
    NEXT_DISABLE_OXIDE: '1',
    SHARP_IGNORE_GLOBAL_LIBVIPS: '1'
  }
};

module.exports = nextConfig;
