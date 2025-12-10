import { envVariables } from "@/lib/env";

export const getReviewsByListingId = async (listingId: string) => {
  const res = await fetch(`${envVariables.BASE_API_URL}/reviews/listing/${listingId}`, {
    cache: "no-store",
  });
  return await res.json();
};
