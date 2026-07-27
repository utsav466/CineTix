import {
  apiClient,
} from "./client";

export type AuthUser = {
  id: string;

  fullName: string;
  name?: string;

  email: string;
  username?: string;
  phone?: string;

  role: string;

  preferredCurrency?:
    | "NPR"
    | "USD"
    | "INR";

  avatarUrl?: string;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;

  data: {
    user: AuthUser;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthUser> {
  const response =
    await apiClient.post<AuthResponse>(
      "/auth/login",
      payload,
    );

  return response.data.data.user;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<void> {
  await apiClient.post(
    "/auth/register",
    payload,
  );
}

export async function getCurrentUser():
  Promise<AuthUser> {
  const response =
    await apiClient.get<AuthResponse>(
      "/auth/me",
    );

  return response.data.data.user;
}

export async function logoutUser():
  Promise<void> {
  await apiClient.post(
    "/auth/logout",
  );
}