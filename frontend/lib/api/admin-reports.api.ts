import {
  apiClient,
} from "./client";

export type ReportRange =
  | "7d"
  | "30d"
  | "90d";

export type DailySalesReport = {
  date: string;
  revenue: number;
  bookings: number;
  confirmed: number;
};

export type TopMovieReport = {
  title: string;
  bookings: number;
  revenue: number;
};

export type AdminSalesReport = {
  range: ReportRange;
  currency: string;

  revenue: number;
  bookings: number;
  confirmed: number;
  cancelled: number;

  daily:
    DailySalesReport[];

  topMovies:
    TopMovieReport[];
};

type SalesReportResponse = {
  success: boolean;

  data:
    AdminSalesReport;
};

export async function getAdminSalesReport(
  range:
    ReportRange,
): Promise<AdminSalesReport> {
  const response =
    await apiClient.get<SalesReportResponse>(
      "/admin/reports/sales",
      {
        params: {
          range,
        },
      },
    );

  return response.data.data;
}