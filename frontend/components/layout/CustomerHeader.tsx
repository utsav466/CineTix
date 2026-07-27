"use client";

import {
  ChevronDown,
  Film,
  LogOut,
  MapPin,
  Menu,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "@/contexts/AuthContext";

const navigationItems = [
  {
    href: "/movies",
    label: "Movies",
  },
  {
    href: "/cinemas",
    label: "Cinemas",
  },
  {
    href: "/offers",
    label: "Offers",
  },
  {
    href: "/my-tickets",
    label: "My Tickets",
  },
];

function getInitials(
  name?: string,
  email?: string,
): string {
  const source =
    name?.trim() ||
    email?.trim() ||
    "User";

  const words =
    source.split(/\s+/);

  if (
    words.length >= 2
  ) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source
    .slice(0, 2)
    .toUpperCase();
}

export default function CustomerHeader() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    user,
    loading,
    authenticated,
    logout,
  } = useAuth();

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false);

  const profileRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    function closeProfile(
      event: MouseEvent,
    ) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileOpen(
          false,
        );
      }
    }

    document.addEventListener(
      "mousedown",
      closeProfile,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeProfile,
      );
    };
  }, []);

  async function handleLogout() {
    await logout();

    setProfileOpen(
      false,
    );

    router.replace(
      "/login",
    );

    router.refresh();
  }

  const displayName =
    user?.fullName ||
    user?.name ||
    "CineTix User";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07080c]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
            <Film
              size={21}
            />
          </span>

          <div>
            <p className="font-black leading-none">
              CineTix
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
              Cinema booking
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigationItems.map(
            (item) => {
              const active =
                pathname ===
                  item.href ||
                pathname.startsWith(
                  `${item.href}/`,
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {
                    item.label
                  }
                </Link>
              );
            },
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm text-white/50 sm:flex">
            <MapPin
              size={16}
            />

            Kathmandu
          </div>

          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          ) : authenticated &&
            user ? (
            <div
              ref={
                profileRef
              }
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (current) =>
                      !current,
                  )
                }
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 transition hover:bg-white/[0.08]"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-red-600 text-xs font-black">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        user.avatarUrl
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(
                      displayName,
                      user.email,
                    )
                  )}
                </span>

                <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                  {
                    displayName
                  }
                </span>

                <ChevronDown
                  size={15}
                  className="text-white/40"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#11141c] p-2 shadow-2xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate text-sm font-bold">
                      {
                        displayName
                      }
                    </p>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {
                        user.email
                      }
                    </p>
                  </div>

                  <Link
                    href="/my-tickets"
                    onClick={() =>
                      setProfileOpen(
                        false,
                      )
                    }
                    className="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
                  >
                    <Ticket
                      size={17}
                    />

                    My Tickets
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() =>
                      setProfileOpen(
                        false,
                      )
                    }
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
                  >
                    <UserRound
                      size={17}
                    />

                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut
                      size={17}
                    />

                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(
                pathname,
              )}`}
              className="flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current,
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X
                size={20}
              />
            ) : (
              <Menu
                size={20}
              />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navigationItems.map(
              (item) => (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={() =>
                    setMenuOpen(
                      false,
                    )
                  }
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
                >
                  {
                    item.label
                  }
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}