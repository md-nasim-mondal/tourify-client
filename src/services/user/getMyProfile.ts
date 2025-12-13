"use server"
import { serverFetch } from "@/lib/server-fetch";

export const getMyProfile = async () => {
  const res = await serverFetch.get("/users/me", {
    cache: "no-store",
  });
  const json = await res.json();
  console.log('API Response:', json);
  return json;
};
