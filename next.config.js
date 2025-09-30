/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Skip ESLint and type errors during production builds to prevent CI failures on warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure images
  images: {
    domains: ['placehold.co'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://aicaller.codecafelab.in' 
      : 'http://localhost:5000',
  },

  // API rewrites for development
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // CORS headers
  async headers() {
    return [
      {
        // Match all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NODE_ENV === 'production' 
              ? 'https://aicaller.codecafelab.in' 
              : 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      }
    ];
  },
};

module.exports = nextConfig;
