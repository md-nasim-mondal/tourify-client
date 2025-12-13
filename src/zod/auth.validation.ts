/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export const registerUserValidationSchema = z
  .object({
    name: z.string().min(2, {
      error: "Name is required and length should be minimum 2 character!",
    }),
    address: z.string().optional(),
    email: z.string().email({ error: "Invalid email address!" }),
    password: z
      .string()
      .min(6, {
        error: "Password is required and length should be minimum 6 character!",
      })
      .max(100, { error: "Password length can be maximum 100 character!" }),
    confirmPassword: z.string().min(6, {
      error: "Password is required and length should be minimum 6 character!",
    }),
    role: z.enum(["TOURIST", "GUIDE"]).optional(),
    contactNo: z.string().optional(),
    expertise: z.string().optional(),
    dailyRate: z.union([z.string(), z.number()]).optional(),
    languagesSpoken: z.string().optional(),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Apply error to confirmPassword field
  });

export const loginValidationSchema = z.object({
  email: z.email({
    error: "Invalid email address!",
  }),
  password: z
    .string()
    .min(6, {
      error: "Password is required and length should be minimum 6 character!",
    })
    .max(100, { error: "Password length can be maximum 100 character!" }),
});

export const forgotPasswordValidationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const resetPasswordValidationSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
