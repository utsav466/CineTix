import type {
  ReactNode,
} from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import AuthGuard from "@/components/auth/AuthGuard";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-[#07080c] text-white">
        <AdminSidebar />

        <main className="min-h-screen px-5 pb-12 pt-20 lg:ml-72 lg:px-8 lg:pt-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}