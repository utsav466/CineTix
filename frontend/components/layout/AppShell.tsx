"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type AppShellProps = {
  children: React.ReactNode;
};

const routesWithoutSiteLayout = [
  "/login",
  "/signup",
];

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const hideSiteLayout =
    routesWithoutSiteLayout.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`),
    );

  if (hideSiteLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
}