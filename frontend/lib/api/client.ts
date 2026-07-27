import axios from "axios";

const apiBaseUrl =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api";

export const apiClient =
  axios.create({
    baseURL:
      apiBaseUrl,

    withCredentials:
      true,

    timeout:
      30000,

    headers: {
      Accept:
        "application/json",
    },
  });

type ApiErrorResponse = {
  message?: string;
  error?: string;

  details?: Array<{
    field?: string;
    message?: string;
  }>;

  errors?: Array<{
    message?: string;
  }>;
};

export function getApiErrorMessage(
  error: unknown,
  fallback =
    "Something went wrong.",
): string {
  if (
    axios.isAxiosError(
      error,
    )
  ) {
    if (
      error.code ===
      "ECONNABORTED"
    ) {
      return "The request took too long. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the CineTix server.";
    }

    const data =
      error.response
        .data as
        | ApiErrorResponse
        | undefined;

    if (
      typeof data?.message ===
        "string" &&
      data.message.trim()
    ) {
      return data.message;
    }

    const detailMessage =
      data?.details?.[0]
        ?.message;

    if (detailMessage) {
      return detailMessage;
    }

    const validationMessage =
      data?.errors?.[0]
        ?.message;

    if (
      validationMessage
    ) {
      return validationMessage;
    }

    if (
      typeof data?.error ===
        "string" &&
      data.error.trim()
    ) {
      return data.error;
    }

    if (
      error.response.status ===
      401
    ) {
      return "Authentication is required.";
    }

    if (
      error.response.status ===
      403
    ) {
      return "Administrator access is required.";
    }

    if (
      error.response.status >=
      500
    ) {
      return "The CineTix server encountered an error.";
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}