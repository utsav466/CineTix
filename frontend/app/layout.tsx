import type { Metadata } from "next";

import AppShell from "@/components/layout/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "CineTix",
  description:
    "Discover movies and book cinema tickets online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}