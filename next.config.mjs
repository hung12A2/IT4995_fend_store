/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", 'github.com'],
  },
  distDir: 'out',
};

export default nextConfig;
