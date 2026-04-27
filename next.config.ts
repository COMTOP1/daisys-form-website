import type { NextConfig } from "next";

const gitCommit = process.env.DFW_GIT_HASH ?? "unknown";
const version = process.env.DFW_VERSION_ARG ?? "v0.0.0";

const nextConfig: NextConfig = {
  env: {
      NEXT_PUBLIC_GIT_COMMIT: gitCommit,
      NEXT_PUBLIC_RELEASE: version,
  },
};

export default nextConfig;
