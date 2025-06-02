import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const GoogleSans = localFont({
  src: [
    {
      path: "../fonts/GoogleSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GoogleSans-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "../fonts/GoogleSans-Bold.woff2",
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
      <body className={`${GoogleSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html >
  );
}