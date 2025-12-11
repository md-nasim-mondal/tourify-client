/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

type BookingStatus = "CONFIRMED" | "CANCELLED";

export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  try {
    const res = await serverFetch.patch(`/bookings/${bookingId}/status`, {
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" }
    });
    
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update booking status.");
    }
    
    revalidatePath("/dashboard/guide");
    
    return {
      success: true,
      message: `Booking ${status.toLowerCase()} successfully!`,
    };

  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
};
