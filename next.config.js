/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['alpromptmaker.online'], // यदि external images use कर रहे हैं
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Build errors को temporarily ignore करने के लिए
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
