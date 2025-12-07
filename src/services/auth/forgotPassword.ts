/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { forgotPasswordValidationSchema } from "@/zod/auth.validation";

export const forgotPassword = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload = {
      email: formData.get("email"),
    };

    // Validate with zod
    const validationResult = zodValidator(
      payload,
      forgotPasswordValidationSchema
    );

    if (validationResult.success === false) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;

    const res = await serverFetch.post("/auth/forgot-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validatedPayload.email }),
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message:
          "Password reset link has been sent to your email. Please check your inbox.",
      };
    }

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
          : "Failed to send reset link. Please try again!"
      }`,
    };
  }
};
