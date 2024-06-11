// eslint-disable-next-line import/no-extraneous-dependencies
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['grammy'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BLOB_HOST_NAME,
      },
    ],
  },
})
