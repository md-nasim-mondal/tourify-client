/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

type UpdateUserData = {
    role?: string;
    status?: string;
}

export const updateUser = async (userId: string, data: UpdateUserData) => {
  try {
    const endpoint = data.role ? 'role' : 'status';
    const res = await serverFetch.patch(`/users/${userId}/${endpoint}`, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });
    
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update user.");
    }
    
    revalidatePath("/dashboard/admin/users");
    
    return {
      success: true,
      message: `User ${endpoint} updated successfully!`,
    };

  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
};
