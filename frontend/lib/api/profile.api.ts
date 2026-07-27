import {
  AuthUser,
} from "./auth.api";

import {
  apiClient,
} from "./client";

import {
  appendFormValue,
} from "./form-data";

type ProfileResponse = {
  success: boolean;
  message?: string;

  data:
    | {
        user:
          AuthUser;
      }
    | AuthUser;
};

export type UpdateProfilePayload = {
  fullName: string;
  email: string;
  phone: string;

  preferredCurrency:
    | "NPR"
    | "USD"
    | "INR";

  avatar?:
    | File
    | null;
};

function responseUser(
  response:
    ProfileResponse,
): AuthUser {
  if (
    "user" in
    response.data
  ) {
    return response.data.user;
  }

  return response.data;
}

export async function getProfile():
  Promise<AuthUser> {
  const response =
    await apiClient.get<ProfileResponse>(
      "/users/me",
    );

  return responseUser(
    response.data,
  );
}

export async function updateProfile(
  payload:
    UpdateProfilePayload,
): Promise<AuthUser> {
  const formData =
    new FormData();

  for (
    const [
      key,
      value,
    ] of Object.entries(
      payload,
    )
  ) {
    appendFormValue(
      formData,
      key,
      value,
    );
  }

  const response =
    await apiClient.put<ProfileResponse>(
      "/users/me",
      formData,
    );

  return responseUser(
    response.data,
  );
}