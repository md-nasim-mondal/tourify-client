import { envVariables } from "@/lib/env";

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

export const initiatePaymentClient = async (payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> => {
  const res = await fetch(`${envVariables.BASE_API_URL}/payments/initiate-stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return await res.json();
};
