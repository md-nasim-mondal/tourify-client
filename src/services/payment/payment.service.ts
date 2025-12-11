/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { redirect } from "next/navigation";

export const initiatePayment = async (formData: FormData) => {
  const data = {
    bookingId: formData.get("bookingId"),
    amount: Number(formData.get("amount")),
  };

  try {
    const res = await serverFetch.post(`/payments/stripe/initiate`, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();

    if (!result.success || !result.data?.url) {
      throw new Error(result.message || "Failed to initiate payment session.");
    }
    
    // Redirect to Stripe checkout
    redirect(result.data.url);

  } catch (err: any) {
    console.error(err);
    redirect("/payment/fail");
  }
};

export const confirmStripePayment = async (sessionId: string) => {
  try {
    const res = await serverFetch.post(`/payments/stripe/confirm`, {
      body: JSON.stringify({ sessionId }),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred during payment confirmation." };
  }
};
