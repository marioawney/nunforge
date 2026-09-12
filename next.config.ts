import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A lockfile exists further up in ~/Desktop/projects; pin the trace root
  // to this app so build output tracing stays scoped correctly.
  outputFileTracingRoot: path.join(__dirname),
  // Lets a verification build run without clobbering the .next that a live
  // `next dev` is serving from.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
};

export default nextConfig;
