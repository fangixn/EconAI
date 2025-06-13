/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/econai' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/econai' : '',
};

module.exports = nextConfig;
