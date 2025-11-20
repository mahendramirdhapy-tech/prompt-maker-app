/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,      // ✅ Correct
  swcMinify: true,           // ✅ Correct  
  eslint: {
    ignoreDuringBuilds: true, // ✅ Correct - ESLint errors ignore
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ Correct - TypeScript errors ignore
  }
}

module.exports = nextConfig   // ✅ Correct export
