import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "APEX Protocol™ - The Emotional Exorcism | Automated Forex Trading",
  description: "Stop losing money trading manually. APEX Protocol™ is a neural adaptive trading system that executes without fear, greed, or ego. Join 400+ profitable traders.",
  keywords: "forex trading bot, automated trading, forex robot, MT4, MT5, algorithmic trading, APEX Protocol",
  openGraph: {
    title: "APEX Protocol™ - The Emotional Exorcism",
    description: "Stop losing money trading manually. Let the machine trade for you while you sleep.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
