/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'vandre-backend.vercel.app',
      'vandre-aws.s3.sa-east-1.amazonaws.com' // Added for S3 images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vandre-backend.vercel.app',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'vandre-aws.s3.sa-east-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;