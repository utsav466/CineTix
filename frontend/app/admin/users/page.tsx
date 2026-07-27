"use client";

import {
  RefreshCw,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminUsers,
} from "@/lib/api/dashboard.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  AdminUser,
} from "@/lib/api/dashboard.types";

export default function AdminUsersPage() {
  const [
    users,
    setUsers,
  ] =
    useState<AdminUser[]>(
      [],
    );

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadUsers(
    refresh = false,
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      setUsers(
        await getAdminUsers(),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load users.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers =
    useMemo(
      () =>
        users.filter(
          (user) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              user.name
                .toLowerCase()
                .includes(query) ||
              user.email
                .toLowerCase()
                .includes(query);

            const matchesRole =
              !role ||
              user.role === role;

            const matchesStatus =
              !status ||
              (
                status ===
                "active" &&
                user.isActive
              ) ||
              (
                status ===
                "inactive" &&
                !user.isActive
              );

            return (
              matchesSearch &&
              matchesRole &&
              matchesStatus
            );
          },
        ),
      [
        users,
        search,
        role,
        status,
      ],
    );

  function clearFilters() {
    setSearch("");
    setRole("");
    setStatus("");
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Accounts
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Users
          </h1>

          <p className="mt-2 text-white/45">
            Review registered customer
            and administrator accounts.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing
          }
          onClick={() => {
            void loadUsers(
              true,
            );
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-4 font-bold text-white/65 hover:bg-white/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search users
            </span>

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search name or email"
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-11 pr-4 outline-none focus:border-red-500"
            />
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(
                event.target.value,
              )
            }
            className="min-h-12 rounded-xl border border-white/10 bg-[#090b10] px-4 outline-none focus:border-red-500"
          >
            <option value="">
              All roles
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="admin">
              Administrators
            </option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
            className="min-h-12 rounded-xl border border-white/10 bg-[#090b10] px-4 outline-none focus:border-red-500"
          >
            <option value="">
              All statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            disabled={
              !search &&
              !role &&
              !status
            }
            onClick={
              clearFilters
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/55 hover:bg-white/5 disabled:opacity-35"
          >
            <X size={17} />

            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-white/40">
          {
            filteredUsers.length
          }{" "}
          of {users.length} users
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/45">
          Loading users...
        </div>
      ) : filteredUsers.length ===
        0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
          <Users
            size={42}
            className="mx-auto text-white/20"
          />

          <h2 className="mt-4 text-xl font-black">
            No users found
          </h2>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map(
            (user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <UserRound
                      size={22}
                    />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      user.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {user.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-black">
                  {user.name}
                </h2>

                <p className="mt-1 break-all text-sm text-white/45">
                  {user.email}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold capitalize text-white/55">
                    {user.role}
                  </span>

                  <span className="text-xs text-white/35">
                    Joined{" "}
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString(
                      "en-US",
                    )}
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}