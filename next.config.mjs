import os from "os";
import path from "path";

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev }) {
    config.resolve.alias["~"] = path.resolve(process.cwd(), "src");

    if (dev && os.platform() === "win32") {
      // Disable persistent webpack disk cache on Windows to avoid EPERM rename failures
      // in .next/cache/webpack when files are locked by the OS or antivirus.
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
