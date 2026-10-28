/** @type {import('next').NextConfig} */
function storageRemotePatterns() {
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET?.trim();
  if (!bucket || /[\\/]/.test(bucket)) return [];
  return [
    {
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
      pathname: `/v0/b/${bucket}/o/**`,
    },
    {
      protocol: "https",
      hostname: "storage.googleapis.com",
      pathname: `/${bucket}/**`,
    },
    {
      protocol: "https",
      hostname: `${bucket}.storage.googleapis.com`,
      pathname: "/**",
    },
  ];
}

const nextConfig = {
  // Disable React strict mode for compatibility with some libraries
  reactStrictMode: false,

  // Image optimization configuration. User media is served same-origin and does not use these.
  images: {
    remotePatterns: storageRemotePatterns(),
    // Optimize image formats (SVGs served as static files via <img>, not executable)
    formats: ["image/avif", "image/webp"],
  },

  // Experimental features
  experimental: {
    // Enable server actions (required for AI SDK)
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
