import { envVariables } from "@/lib/env";

export const getListingsByGuideId = async (guideId: string) => {
  const res = await fetch(`${envVariables.BASE_API_URL}/listings?guideId=${guideId}`, {
    cache: "no-store",
  });
  return await res.json();
};
