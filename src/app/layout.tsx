import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const GoogleSans = localFont({
  src: [
    {
      path: "/fonts/GoogleSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/GoogleSans-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "/fonts/GoogleSans-Bold.woff2",
      weight: "700",
      style: "bold",
    }
  ],
});

export const metadata: Metadata = {
  title: "Spark AI",
  description: "Transform your ideas into code with AI-powered development",
  icons: { icon: "/logo.svg" },
  keywords: ["AI", "development", "code", "ideas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GoogleSans.className} antialiased relative`}>
        {/* Background */}
        <img
          src="/images/bg.webp"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html >
  );
}