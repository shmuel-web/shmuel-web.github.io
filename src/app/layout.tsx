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

export const metadata: Metadata = {
  title: "בין העולמות • Between Worlds",
  description: "מאמרים על כל מה שבין תורה, מדע וחברה. / Essays at the intersection of Torah, science, and society.",
  icons: {
    icon: "/logo.svg",
  },
  alternates: {
    languages: {
      'he': '/he/',
      'en': '/en/',
      'x-default': '/'
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
