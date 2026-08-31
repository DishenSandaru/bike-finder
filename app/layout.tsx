import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const LOGO_URL = "https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/bikefinderlogo.jpeg";

export const metadata: Metadata = {
  title: "BikeFinder",
  description: "Discover, compare, and find your perfect motorcycle.",
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={LOGO_URL} type="image/jpeg" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}