import {
  apiClient,
} from "./client";

import {
  appendFormValue,
} from "./form-data";

import type {
  Cinema,
  CinemaInput,
  Screen,
  ScreenInput,
} from "./cinemas.types";

type CinemaListResponse = {
  success: true;

  data: {
    items: Cinema[];
  };
};

type CinemaResponse = {
  success: true;

  data: {
    cinema: Cinema;
    screens?: Screen[];
  };
};

type ScreenListResponse = {
  success: true;

  data: {
    items: Screen[];
  };
};

type ScreenResponse = {
  success: true;

  data: {
    screen: Screen;
  };
};

function cinemaFormData(
  payload:
    Partial<CinemaInput>,
): FormData {
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

  return formData;
}

export async function getCinemas(
  params?: {
    search?: string;
    city?: string;
    active?: boolean;
  },
): Promise<Cinema[]> {
  const response =
    await apiClient.get<CinemaListResponse>(
      "/cinemas",
      {
        params,
      },
    );

  return response.data.data.items;
}

export async function getCinema(
  id: string,
): Promise<Cinema> {
  const response =
    await apiClient.get<CinemaResponse>(
      `/cinemas/${id}`,
    );

  return response.data.data.cinema;
}

export async function createCinema(
  payload: CinemaInput,
): Promise<Cinema> {
  const response =
    await apiClient.post<CinemaResponse>(
      "/cinemas",
      cinemaFormData(
        payload,
      ),
    );

  return response.data.data.cinema;
}

export async function updateCinema(
  id: string,
  payload:
    Partial<CinemaInput>,
): Promise<Cinema> {
  const response =
    await apiClient.patch<CinemaResponse>(
      `/cinemas/${id}`,
      cinemaFormData(
        payload,
      ),
    );

  return response.data.data.cinema;
}

export async function deleteCinema(
  id: string,
): Promise<void> {
  await apiClient.delete(
    `/cinemas/${id}`,
  );
}

export async function getScreens(
  params?: {
    cinemaId?: string;
  },
): Promise<Screen[]> {
  const response =
    await apiClient.get<ScreenListResponse>(
      "/screens",
      {
        params,
      },
    );

  return response.data.data.items;
}

export async function getScreen(
  id: string,
): Promise<Screen> {
  const response =
    await apiClient.get<ScreenResponse>(
      `/screens/${id}`,
    );

  return response.data.data.screen;
}

export async function createScreen(
  payload: ScreenInput,
): Promise<Screen> {
  const response =
    await apiClient.post<ScreenResponse>(
      "/screens",
      payload,
    );

  return response.data.data.screen;
}

export async function updateScreen(
  id: string,
  payload:
    Partial<ScreenInput>,
): Promise<Screen> {
  const response =
    await apiClient.patch<ScreenResponse>(
      `/screens/${id}`,
      payload,
    );

  return response.data.data.screen;
}

export async function deleteScreen(
  id: string,
): Promise<void> {
  await apiClient.delete(
    `/screens/${id}`,
  );
}