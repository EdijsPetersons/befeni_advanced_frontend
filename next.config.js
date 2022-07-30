/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["assets.befeni.de", "fra1.digitaloceanspaces.com"],
  },
}

module.exports = nextConfig
