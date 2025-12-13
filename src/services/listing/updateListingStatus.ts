
"use server";

import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const updateListingStatus = async (id: string, status: "ACTIVE" | "BLOCKED") => {
  try {
    const token = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${envVariables.BASE_API_URL}/listings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
      revalidateTag("listings", { expire: 0 });
      return result;
    } else {
      return { success: false, message: result.message || "Failed to update status" };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
