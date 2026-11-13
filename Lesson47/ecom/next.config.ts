import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Turbopack mis-wraps the CJS Mongo connection-string helper, so
  // `new ConnectionString()` throws and Prisma reports an invalid URL.
  serverExternalPackages: [
    '@prisma/orm-mongo',
    '@prisma/orm-family-mongo',
    '@prisma/orm-target-mongo',
    '@prisma/orm-framework',
    'mongodb-connection-string-url',
    'whatwg-url',
    'mongodb',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
