import { LicenseWebpackPlugin } from "license-webpack-plugin";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const LicenseWebpackPlugin =
//   require("license-webpack-plugin").LicenseWebpackPlugin;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      // !dev &&
      config.plugins.push(
        new LicenseWebpackPlugin({
          perChunkOutput: false,
          outputFilename: "licenses.txt",
          stats: {
            warnings: true,
            errors: true,
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
