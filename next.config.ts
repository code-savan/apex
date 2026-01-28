import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/TOP-3-GOLD-TRADING-STRATEGIES.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment; filename=TOP-3-GOLD-TRADING-STRATEGIES.pdf",
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
