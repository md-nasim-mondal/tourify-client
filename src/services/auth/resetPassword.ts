/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { resetPasswordValidationSchema } from "@/zod/auth.validation";

export const resetPassword = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload = {
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate with zod
    const validationResult = zodValidator(payload, resetPasswordValidationSchema);
    
    if (validationResult.success === false) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;
    const token = validatedPayload.token;

    const res = await serverFetch.post("/auth/reset-password", {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ password: validatedPayload.password }),
    });

    const result = await res.json();

    return result;
  } catch (err: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    
    console.log(err);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? err.message
          : "Failed to reset password. Please try again!"
      }`,
    };
  }
};