/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'steamcommunity-a.akamaihd.net',
      'community.cloudflare.steamstatic.com',
      'avatars.steamstatic.com',
    ],
  },
}

module.exports = nextConfig