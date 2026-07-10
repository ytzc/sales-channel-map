/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Required for static site export (GitHub Pages)
  images: {
    unoptimized: true, // Required for static export in Next.js
  },
  // Set the base path to the GitHub repository name in production
  basePath: isProd ? '/channel-war-map' : '',
};

export default nextConfig;
