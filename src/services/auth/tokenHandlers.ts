"use server";

import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setCookie = async (
  key: string,
  value: string,
  options: Partial<ResponseCookie> = {}
) => {
  const cookieStore = await cookies();
  
  const defaultOptions: Partial<ResponseCookie> = {
    // To send cross-site cookies with SameSite=None, they *must* be Secure.
    // So, force secure: true if sameSite is none.
    secure: true,
    httpOnly: true,
    sameSite: "none", // Allow cross-site requests to send cookies
    path: "/",
    // domain: process.env.NODE_ENV === "development" ? "localhost" : undefined, // Specify domain for consistency
  };

  cookieStore.set(key, value, { ...defaultOptions, ...options });
};

export const getCookie = async (key: string): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie?.value || null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

export const deleteCookie = async (key: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

export const clearAuthCookies = async () => {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  await deleteCookie("userRole");
  await deleteCookie("userEmail");
};