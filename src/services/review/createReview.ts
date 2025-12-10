/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createReview = async (_currentState: any, formData: FormData) => {
  const data = {
    bookingId: formData.get("bookingId"),
    listingId: formData.get("listingId"),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
  };

  try {
    const res = await serverFetch.post(`/reviews`, {
      body: JSON.stringify(data),
       headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to submit review.",
        errors: result.error?.issues
      };
    }

  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }

  revalidatePath(`/tours/${data.listingId}`); // Revalidate the public tour page to show the new review
  revalidatePath("/dashboard/tourist/bookings"); // Revalidate bookings page to maybe hide the review button
  redirect("/dashboard/tourist/bookings");
};
