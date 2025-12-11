import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

export default async function TouristReviewsPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/reviews`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const reviews: { id: string; rating: number; comment: string; listing?: { title?: string } }[] = json?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">My Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded p-3">
            <p className="font-medium">{r.listing?.title || "Tour"}</p>
            <p>Rating: {r.rating}</p>
            <p className="text-sm text-zinc-600">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
