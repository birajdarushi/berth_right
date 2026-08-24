import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MockDataBanner from "@/components/MockDataBanner";
import { DemoStateProvider } from "@/lib/demo-state";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berth Right",
  description: "A prototype of gender-aware RAC berth pairing and entitlement — unaffiliated hackathon demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MockDataBanner />
        <DemoStateProvider>{children}</DemoStateProvider>
      </body>
    </html>
  );
}
