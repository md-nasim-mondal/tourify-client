/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

export const updateMyProfile = async (_currentState: any, formData: FormData) => {
  try {
    const data: Record<string, any> = {};
    const finalFormData = new FormData();

    // Fields that should be arrays
    const arrayFields = ["languagesSpoken", "expertise", "travelPreferences"];
    // Fields that should be numbers
    const numberFields = ["dailyRate"];

    for (const [key, value] of formData.entries()) {
      if (key === "file") {
         if((value as File).size > 0){
            finalFormData.append(key, value);
         }
      } else if (arrayFields.includes(key) && typeof value === 'string') {
        data[key] = value.split(",").map((item) => item.trim()).filter(Boolean);
      } else if (numberFields.includes(key) && typeof value === 'string') {
        data[key] = Number(value);
      } else {
        data[key] = value;
      }
    }

    finalFormData.append("data", JSON.stringify(data));

    const res = await serverFetch.patch(`/users/update-my-profile`, {
      body: finalFormData,
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
