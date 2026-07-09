import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its built-in font metrics files from disk relative to its
  // own package directory at runtime — bundling it breaks those paths, so
  // it needs to stay an unbundled, regular Node require.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
