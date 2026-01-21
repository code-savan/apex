import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
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

        {/* Tawk.to Chat Widget */}
        <Script
          id="tawk-to"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/6970cf820d0307197e8789ae/1jfgal7gu';
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
