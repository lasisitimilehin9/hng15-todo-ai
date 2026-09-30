import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HNG15 Todo AI",
  description: "Simple To-Do List app for HNG Internship 15 - Stage 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
