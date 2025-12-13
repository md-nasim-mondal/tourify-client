"use server";
import { serverFetch } from "@/lib/server-fetch";

export const getMyPayments = async () => {
  const res = await serverFetch.get("/payments", {
    cache: "no-store",
  });
  return await res.json();
};
