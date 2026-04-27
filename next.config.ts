import type { NextConfig } from "next";
import {execFileSync} from "node:child_process";

const gitCommit =
    process.env.DFW_GIT_HASH ??
    execFileSync("/usr/bin/git", ["rev-parse", "HEAD"]).toString().trim();
const version = process.env.DFW_VERSION_ARG ?? "v0.0.0";

const nextConfig: NextConfig = {
  env: {
      NEXT_PUBLIC_GIT_COMMIT: gitCommit,
      NEXT_PUBLIC_RELEASE: version,
  }
};

export default nextConfig;
