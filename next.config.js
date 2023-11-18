/** @type {import('next').NextConfig} */
const { webpack } = require("next/dist/compiled/webpack/webpack");
const nextConfig = {
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-proxy.svc.prod.covalenthq.com",
      },
      {
        protocol: "https",
        hostname: "nftassets.covalenthq.com",
      },
    ],
  },
};

module.exports = nextConfig;
