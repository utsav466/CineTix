"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthUser,
  getCurrentUser,
  loginUser,
  LoginPayload,
  logoutUser,
} from "@/lib/api/auth.api";

type AuthContextValue = {
  user:
    | AuthUser
    | null;

  loading: boolean;
  authenticated: boolean;

  login(
    payload: LoginPayload,
  ): Promise<AuthUser>;

  logout():
    Promise<void>;

  refreshUser():
    Promise<AuthUser | null>;
};

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children:
    ReactNode;
}) {
  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const refreshUser =
    useCallback(
      async (): Promise<AuthUser | null> => {
        try {
          const currentUser =
            await getCurrentUser();

          setUser(
            currentUser,
          );

          return currentUser;
        } catch {
          setUser(null);

          return null;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const login =
    useCallback(
      async (
        payload:
          LoginPayload,
      ): Promise<AuthUser> => {
        const signedInUser =
          await loginUser(
            payload,
          );

        setUser(
          signedInUser,
        );

        setLoading(
          false,
        );

        return signedInUser;
      },
      [],
    );

  const logout =
    useCallback(
      async (): Promise<void> => {
        try {
          await logoutUser();
        } finally {
          setUser(null);
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,

        loading,

        authenticated:
          Boolean(user),

        login,

        logout,

        refreshUser,
      }),
      [
        user,
        loading,
        login,
        logout,
        refreshUser,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth():
  AuthContextValue {
  const context =
    useContext(
      AuthContext,
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}