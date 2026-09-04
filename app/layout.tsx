import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { DemoStateProvider } from "@/lib/demo-state";
import { I18nProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berthright.birajdar.in"),
  title: "Berth Right",
  description: "A prototype of gender-aware RAC berth pairing and entitlement — unaffiliated hackathon demo.",
  icons: { icon: "/brand/favicon-32.png", apple: "/brand/app-icon-192.png" },
  openGraph: { images: ["/brand/og-sleeper.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <I18nProvider>
          <DemoStateProvider>
            <AppShell>{children}</AppShell>
          </DemoStateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
