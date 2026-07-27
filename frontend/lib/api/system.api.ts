import { apiClient } from "./client";
import type { ApiSuccessResponse } from "./types";

export type HealthData = {
  environment: string;
  timestamp: string;
};

export async function getApiHealth(): Promise<
  ApiSuccessResponse<HealthData>
> {
  const response = await apiClient.get<
    ApiSuccessResponse<HealthData>
  >("/health");

  return response.data;
}