/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

export const deleteListing = async (listingId: string) => {
  try {
    const res = await serverFetch.delete(`/listings/${listingId}`);
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete listing.");
    }
    
    revalidatePath("/dashboard/guide/listings");
    
    return {
      success: true,
      message: "Listing deleted successfully!",
    };

  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
};
