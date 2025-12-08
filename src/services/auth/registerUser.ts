/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
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
    };

    // Validate with zod
    const validationResult = zodValidator(
      payload,
      registerUserValidationSchema
    );

    if (validationResult.success === false) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;

    const registerData = {
      name: validatedPayload.name,
      email: validatedPayload.email,
      password: validatedPayload.password,
      address: validatedPayload.address,
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));

    // Handle profile picture upload
    const profilePicture = formData.get("profilePicture") as File;
    if (profilePicture && profilePicture.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(profilePicture.type)) {
        return {
          success: false,
          errors: [
            {
              field: "profilePicture",
              message: "Only JPG, PNG, and WebP images are allowed",
            },
          ],
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (profilePicture.size > maxSize) {
        return {
          success: false,
          errors: [
            {
              field: "profilePicture",
              message: "Image size should be less than 5MB",
            },
          ],
        };
      }

      newFormData.append("profilePicture", profilePicture);
    }

    const res = await serverFetch.post("/auth/register", {
      body: newFormData,
    });

    const result = await res.json();

    if (result.success) {
      // Auto login after successful registration
      const loginFormData = new FormData();
      loginFormData.append("email", validatedPayload.email);
      loginFormData.append("password", validatedPayload.password);
      
      await loginUser(_currentState, loginFormData);
      
      return {
        success: true,
        message: "Account created successfully! Redirecting...",
      };
    }

    return result;
  } catch (err: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    
    console.error("Registration error:", err);
    
    // Handle specific error types
    if (err.name === "NetworkError") {
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    }
    
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? err.message
          : "Registration failed. Please try again!"
      }`,
    };
  }
};