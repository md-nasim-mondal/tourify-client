import { envVariables } from "@/lib/env";

export const getSingleUser = async (id: string) => {
  const res = await fetch(`${envVariables.BASE_API_URL}/users/public/${id}`, {
    cache: "no-store",
  });
  return await res.json();
};
