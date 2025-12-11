"use server";
import { serverFetch } from "@/lib/server-fetch";

export const getDashboardMetadata = async () => {
  const res = await serverFetch.get("/meta");
  return await res.json();
};

