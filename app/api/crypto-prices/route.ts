import { NextResponse } from "next/server";

// CoinGecko IDs for our supported cryptocurrencies
const cryptoIds: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  usdt: "tether",
  sol: "solana",
  ltc: "litecoin",
};

export async function GET() {
  try {
    const ids = Object.values(cryptoIds).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }

    const data = await response.json();

    // Convert to our format (symbol -> price)
    const prices: Record<string, number> = {};
    for (const [symbol, geckoId] of Object.entries(cryptoIds)) {
      if (data[geckoId]?.usd) {
        prices[symbol] = data[geckoId].usd;
      }
    }

    return NextResponse.json({ prices, timestamp: Date.now() });
  } catch (error) {
    console.error("Crypto price fetch error:", error);

    // Return fallback prices if API fails
    return NextResponse.json({
      prices: {
        btc: 100000,
        eth: 3800,
        usdt: 1,
        sol: 200,
        ltc: 100,
      },
      timestamp: Date.now(),
      fallback: true,
    });
  }
}
