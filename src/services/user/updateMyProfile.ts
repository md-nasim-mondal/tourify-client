/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

export const updateMyProfile = async (_currentState: any, formData: FormData) => {
  try {
    const res = await serverFetch.patch(`/users/update-my-profile`, {
      body: formData,
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Profile Update Failed!");
    }
    
    revalidatePath("/profile/me");

    return {
        success: true,
        message: "Profile updated successfully!"
    }
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? err.message
          : "Profile Update Failed!."
      }`,
    };
  }
};
