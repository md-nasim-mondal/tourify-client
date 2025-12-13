/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import type { UserRole } from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserValidationSchema } from "@/zod/auth.validation";

export const registerUser = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      contactNo: formData.get("contactNo"),
      role: formData.get("role") || "TOURIST",
      expertise: formData.get("expertise") || "",
      dailyRate: formData.get("dailyRate") || "",
      languagesSpoken: formData.get("languagesSpoken") || "",
      bio: formData.get("bio") || "",
    };

    // Validate with zod
    const validationResult = zodValidator(payload, registerUserValidationSchema);
    
    if (validationResult.success === false) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;

    // Prepare data based on role
    const registerData: any = {
      name: validatedPayload.name,
      email: validatedPayload.email,
      password: validatedPayload.password,
      address: validatedPayload.address,
      contactNo: validatedPayload.contactNo,
      role: validatedPayload.role as UserRole,
    };

    // Add guide-specific fields if role is GUIDE
    if (validatedPayload.role === "GUIDE") {
      registerData.expertise = validatedPayload.expertise || "";
      registerData.languagesSpoken = validatedPayload.languagesSpoken || "";
      registerData.dailyRate = validatedPayload.dailyRate 
        ? parseFloat(validatedPayload.dailyRate)
        : null;
      registerData.bio = validatedPayload.bio || "";
    }

    const res = await serverFetch.post("/auth/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    const result = await res.json();

    if (result.success) {
      // Redirect to verify-email page after registration
      // The user will receive an email with verification link
      // Note: This redirect will be handled by the form submission response
      return {
        ...result,
        redirectTo: `/verify-email?email=${encodeURIComponent(validatedPayload.email)}`,
      };
    }

    return {
        success: false,
        message: result.message || "Registration Failed!",
        errors: result.errorSources, // Pass validation errors if any
    };
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
          : "Registration Failed. Please try again!"
      }`,
    };
  }
};