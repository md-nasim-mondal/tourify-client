import { serverFetch } from "@/lib/server-fetch";

interface InitiatePaymentPayload {
  bookingId: string;
  amount: number;
}

interface InitiatePaymentResponse {
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentUrl: string;
  sessionId?: string; // For Stripe
  success: boolean;
  message?: string;
}

export const initiatePaymentClient = async (
  payload: InitiatePaymentPayload,
  accessToken: string
): Promise<InitiatePaymentResponse> => {
  const res = await serverFetch.post(
    `/payments/stripe/initiate`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      accessToken,
    }
  );
  return await res.json();
};
