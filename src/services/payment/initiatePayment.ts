import { envVariables } from "@/lib/env";
import { getCookie } from "../auth/tokenHandlers";

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
  payload: InitiatePaymentPayload
): Promise<InitiatePaymentResponse> => {
  const accessToken = await getCookie("accessToken");
  const res = await fetch(
    `${envVariables.BASE_API_URL}/payments/stripe/initiate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: accessToken ? `accessToken=${accessToken}` : "",
      },
      body: JSON.stringify(payload),
    }
  );
  return await res.json();
};
