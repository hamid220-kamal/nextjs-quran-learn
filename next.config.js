/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  
  // ✅ FIXED: Enforce code quality in production
  eslint: {
    // Fail builds with ESLint errors - ensures code quality
    ignoreDuringBuilds: false,
  },
  
  // ✅ FIXED: Enforce TypeScript type safety
  typescript: {
    // Fail builds with TypeScript errors - ensures type safety
    ignoreBuildErrors: false,
  },
  
  // ✅ Image optimization for SEO and performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // ✅ Security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=()'
          }
        ],
      },
    ];
  },
  
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
}

module.exports = nextConfig
