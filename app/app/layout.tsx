import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppWalletProvider from "../components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina | Verifiable On-Chain Education",
  description: "Decentralized education and credentialing platform on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen`} suppressHydrationWarning>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}