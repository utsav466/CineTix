import {
  apiClient,
} from "./client";

import {
  appendFormValue,
} from "./form-data";

export type AdminSettings = {
  id: string;
  storeName: string;
  supportEmail: string;

  currency:
    | "NPR"
    | "USD"
    | "INR";

  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;

  createdAt?: string;
  updatedAt?: string;
};

export type UpdateSettingsInput = {
  storeName: string;
  supportEmail: string;

  currency:
    | "NPR"
    | "USD"
    | "INR";

  logoImage?:
    | File
    | null;

  faviconImage?:
    | File
    | null;

  heroImage?:
    | File
    | null;

  removeLogo?: boolean;
  removeFavicon?: boolean;
  removeHeroImage?: boolean;
};

type SettingsResponse = {
  success: boolean;
  message?: string;
  data: AdminSettings;
};

export async function getAdminSettings():
  Promise<AdminSettings> {
  const response =
    await apiClient.get<SettingsResponse>(
      "/admin/settings",
    );

  return response.data.data;
}

export async function updateAdminSettings(
  payload:
    UpdateSettingsInput,
): Promise<AdminSettings> {
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
    await apiClient.patch<SettingsResponse>(
      "/admin/settings",
      formData,
    );

  return response.data.data;
}