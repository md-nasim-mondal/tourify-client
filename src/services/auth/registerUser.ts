/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import type { UserRole } from "@/lib/auth-utils";
import { loginUser } from "./loginUser";
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
      registerData.expertise = validatedPayload.expertise 
        ? validatedPayload.expertise.split(",").map((item: string) => item.trim())
        : [];
      registerData.languagesSpoken = validatedPayload.languagesSpoken
        ? validatedPayload.languagesSpoken.split(",").map((item: string) => item.trim())
        : [];
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
      // Auto-login after registration
      const loginPayload = {
        email: validatedPayload.email,
        password: validatedPayload.password,
      };
      
      const loginFormData = new FormData();
      loginFormData.append("email", loginPayload.email);
      loginFormData.append("password", loginPayload.password);
      
      await loginUser(_currentState, loginFormData);
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
          : "Registration Failed. Please try again!"
      }`,
    };
  }
};