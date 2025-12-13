"use server"
import { serverFetch } from "@/lib/server-fetch";

export const getAllUsers = async (query?: string) => {
  const res = await serverFetch.get(`/users?${query}`);
  return await res.json();
};
