import {
  apiClient,
} from "./client";

type KhaltiInitiateResponse = {
  success: true;

  message: string;

  data: {
    bookingId: string;

    alreadyPaid?: boolean;

    ticketUrl?: string;

    pidx?: string;

    paymentUrl?: string;

    expiresAt?: string;

    expiresIn?: number;
  };
};

type KhaltiVerificationResponse = {
  success: boolean;

  message: string;

  data: {
    bookingId: string;

    bookingStatus: string;

    paymentStatus: string;

    khaltiStatus?: string;

    transactionId?: string;

    amount?: number;
  };
};

export async function initiateKhaltiPayment(
  bookingId: string,
) {
  const response =
    await apiClient.post<KhaltiInitiateResponse>(
      "/payments/khalti/initiate",
      {
        bookingId,
      },
    );

  return response.data.data;
}

export async function verifyKhaltiPayment(
  bookingId: string,
) {
  const response =
    await apiClient.get<KhaltiVerificationResponse>(
      `/payments/khalti/verify/${bookingId}`,
    );

  return response.data.data;
}