export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiFailureResponse = {
  success: false;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiFailureResponse;