
"use server";

import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const deleteListing = async (id: string) => {
  try {
    const token = (await cookies()).get("accessToken")?.value;
    const res = await fetch(`${envVariables.BASE_API_URL}/listings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
      },
    });
    const result = await res.json();
    if (result.success) {
      revalidateTag("listings", { expire: 0 });
      return result;
    } else {
      return { success: false, message: result.message || "Failed to delete listing" };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
