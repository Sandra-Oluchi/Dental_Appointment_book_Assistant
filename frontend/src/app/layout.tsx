import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dental Clinic AI",
  description: "Dental booking and patient assistant demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
