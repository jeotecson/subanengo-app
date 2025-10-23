import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";
import runtimeCaching from "next-pwa/cache";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", 
  fallbacks: {
    document: "/~offline", 
  },
  runtimeCaching: [
    ...runtimeCaching,

    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },

    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|mp3|m4a|wav)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "media-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, 
        },
      },
    },

    {
      urlPattern: /\/(lesson|practice|dashboard)(\/|$)/,
      handler: "NetworkFirst",
      options: {
        cacheName: "page-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, 
        },
      },
    },

    {
      urlPattern: /^https?.*\/api\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, 
        },
      },
    },

    {
      urlPattern: /\/api\/submit-progress/,
      handler: "NetworkOnly",
      options: {
        backgroundSync: {
          name: "progress-sync-queue",
          options: {
            maxRetentionTime: 24 * 60, 
          },
        },
      },
    },
  ],
});

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},

  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Content-Range", value: "bytes : 0-9/*" },
        ],
      },
    ];
  },
};

const config = withNextIntl(withPWA(nextConfig));

// @ts-ignore – next-pwa and Next.js types differ slightly
export default config;
