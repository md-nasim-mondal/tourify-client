/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateListing = async (listingId: string, _currentState: any, formData: FormData) => {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    price: Number(formData.get("price")),
    duration: Number(formData.get("duration")),
    meetingPoint: formData.get("meetingPoint"),
    maxGroupSize: Number(formData.get("maxGroupSize")),
    category: formData.getAll("category"),
    language: formData.getAll("language"),
    keptImages: formData.getAll("keptImages"),
  };

  const multipart = new FormData();
  const images = formData.getAll("images") as File[];
  
  images.forEach((file) => {
    if (file.size > 0) {
      multipart.append("images", file)
    }
  });

  multipart.append("data", JSON.stringify(data));

  try {
    const res = await serverFetch.patch(`/listings/${listingId}`, {
      body: multipart,
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update listing. Please check the fields.",
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

  revalidatePath(`/dashboard/guide/listings/edit/${listingId}`);
  revalidatePath("/dashboard/guide/listings");
  redirect("/dashboard/guide/listings");
};
