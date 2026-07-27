"use client";

import {
  Armchair,
  BarChart3,
  Building2,
  CalendarDays,
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Tag,
  Ticket,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  useAuth,
} from "@/contexts/AuthContext";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    label: "Movies",
    href: "/admin/movies",
    icon: Film,
  },

  {
    label: "Cinemas",
    href: "/admin/cinemas",
    icon: Building2,
  },

  {
    label: "Halls & Screens",
    href: "/admin/halls",
    icon: Armchair,
  },

  {
    label: "Showtimes",
    href: "/admin/showtimes",
    icon: CalendarDays,
  },

  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: Ticket,
  },

  {
    label: "Food & Beverages",
    href: "/admin/foods",
    icon: UtensilsCrossed,
  },

  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },

  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },

  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    user,
    logout,
  } = useAuth();

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  function isActive(
    href: string,
  ): boolean {
    if (href === "/admin") {
      return pathname ===
        "/admin";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();
    } catch {
      // AuthContext still clears
      // local user state.
    } finally {
      router.replace(
        "/login",
      );

      router.refresh();

      setLoggingOut(false);
    }
  }

  const adminName =
    user?.fullName ||
    user?.name ||
    "Administrator";

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
            <Ticket
              size={22}
            />
          </span>

          <div>
            <p className="text-lg font-black">
              CineTix
            </p>

            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              Administration
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(false)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
        aria-label="Administrator navigation"
      >
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              isActive(
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(
                    false,
                  )
                }
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />

                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="truncate text-sm font-bold">
            {adminName}
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          disabled={loggingOut}
          onClick={() => {
            void handleLogout();
          }}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/55 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut size={19} />

          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#11141c] text-white shadow-xl lg:hidden"
        aria-label="Open administrator navigation"
      >
        <Menu size={21} />
      </button>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-[#090b10] text-white lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close navigation overlay"
          />

          <aside className="relative flex h-full w-[86%] max-w-72 flex-col border-r border-white/10 bg-[#090b10] text-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}