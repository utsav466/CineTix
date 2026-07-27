import {
  apiClient,
} from "./client";

import type {
  CheckoutFoodInput,
  HeldBooking,
  ShowtimeSeatData,
} from "./bookings.types";

type SeatResponse = {
  success: true;

  data:
    ShowtimeSeatData;
};

type BookingResponse = {
  success: true;

  message?: string;

  data: {
    booking: HeldBooking;
  };
};

export async function getShowtimeSeats(
  showtimeId: string,
): Promise<ShowtimeSeatData> {
  const response =
    await apiClient.get<SeatResponse>(
      `/seats/showtime/${showtimeId}`,
    );

  return response.data.data;
}

export async function holdSeats(
  showtimeId: string,
  seatCodes: string[],
): Promise<HeldBooking> {
  const response =
    await apiClient.post<BookingResponse>(
      "/bookings/hold",
      {
        showtimeId,
        seatCodes,
      },
    );

  return response.data.data.booking;
}

export async function getBooking(
  bookingId: string,
): Promise<HeldBooking> {
  const response =
    await apiClient.get<BookingResponse>(
      `/bookings/${bookingId}`,
    );

  return response.data.data.booking;
}

export async function updateBookingCheckout(
  bookingId: string,
  foodItems: CheckoutFoodInput[],
  couponCode = "",
): Promise<HeldBooking> {
  const response =
    await apiClient.patch<BookingResponse>(
      `/bookings/${bookingId}/checkout`,
      {
        foodItems,
        couponCode,
      },
    );

  return response.data.data.booking;
}

export async function removeBookingCoupon(
  bookingId: string,
): Promise<HeldBooking> {
  const response =
    await apiClient.delete<BookingResponse>(
      `/bookings/${bookingId}/coupon`,
    );

  return response.data.data.booking;
}

export async function cancelBookingHold(
  bookingId: string,
): Promise<void> {
  await apiClient.delete(
    `/bookings/${bookingId}/hold`,
  );
}