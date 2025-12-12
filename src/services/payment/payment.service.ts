/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { redirect } from "next/navigation";

export const initiatePayment = async (formData: FormData) => {
  const data = {
    bookingId: formData.get("bookingId"),
    amount: Number(formData.get("amount")),
  };

  let url: string | undefined;
  try {
    const res = await serverFetch.post(`/payments/stripe/initiate`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    url = result?.data?.paymentUrl;
    if (!result.success || !url) {
      return redirect("/payment/fail");
    }
  } catch {
    return redirect("/payment/fail");
  }
  redirect(url);
};

export const confirmStripePayment = async (sessionId: string) => {
  try {
    const res = await serverFetch.post(`/payments/stripe/confirm`, {
      body: JSON.stringify({ sessionId }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message || "An error occurred during payment confirmation.",
    };
  }
};

export const releasePayout = async (formData: FormData) => {
  const paymentId = String(formData.get("paymentId") || "");
  try {
    const res = await serverFetch.post(`/payments/release-payout`, {
      body: JSON.stringify({ paymentId }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to release payout.",
    };
  }
};
