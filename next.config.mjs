//

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import { LicenseWebpackPlugin } from "license-webpack-plugin";
// import path from "path";
// const __dirname = path.resolve();

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (!isServer && !dev) {
      config.plugins.push(
        new LicenseWebpackPlugin({
          // perChunkOutput: false,
          // outputFilename: "licenses.txt",
          stats: {
            warnings: true,
            errors: true,
          },
          modulesDirectories: ["node_modules"],
          // modulesDirectories: [path.resolve(__dirname, "node_modules")],
          // reactStrictMode: false,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
