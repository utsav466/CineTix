import { AuthUser } from "./auth.types";

const TOKEN_KEY =
  "cinetix_access_token";

const USER_KEY =
  "cinetix_user";

export function saveAuthSession(
  token: string,
  user: AuthUser,
  rememberMe = true,
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  const storage = rememberMe
    ? window.localStorage
    : window.sessionStorage;

  /*
   * Remove old session from both stores before
   * saving the new one.
   */
  clearAuthSession();

  storage.setItem(
    TOKEN_KEY,
    token,
  );

  storage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

export function getAuthToken():
  | string
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return (
    window.localStorage.getItem(
      TOKEN_KEY,
    ) ??
    window.sessionStorage.getItem(
      TOKEN_KEY,
    )
  );
}

export function getStoredUser():
  | AuthUser
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  const storedValue =
    window.localStorage.getItem(
      USER_KEY,
    ) ??
    window.sessionStorage.getItem(
      USER_KEY,
    );

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(
      storedValue,
    ) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  window.localStorage.removeItem(
    TOKEN_KEY,
  );

  window.localStorage.removeItem(
    USER_KEY,
  );

  window.sessionStorage.removeItem(
    TOKEN_KEY,
  );

  window.sessionStorage.removeItem(
    USER_KEY,
  );

  /*
   * Remove old temporary keys from your
   * previous frontend-only implementation.
   */
  window.localStorage.removeItem(
    "cinetix-auth",
  );

  window.localStorage.removeItem(
    "cinetix-user",
  );
}