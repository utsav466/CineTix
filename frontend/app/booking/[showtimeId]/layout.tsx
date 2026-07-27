import type {
  ReactNode,
} from "react";

import AuthGuard from "@/components/auth/AuthGuard";

export default function BookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}