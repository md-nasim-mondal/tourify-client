import { envVariables } from "@/lib/env";
export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteListingButton from "@/components/modules/listing/DeleteListingButton";

export default async function GuideListingsPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/listings?mine=true`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const listings: { id: string; title: string; location: string; price: number }[] = json?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Button asChild>
            <Link href="/dashboard/guide/listings/create">Create New Listing</Link>
        </Button>
      </div>
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((it) => (
            <div key={it.id} className="border rounded-lg shadow-sm flex flex-col">
              <div className="p-4 grow">
                <p className="font-medium text-lg">{it.title}</p>
                <p className="text-sm text-zinc-600 mt-1">{it.location}</p>
                <p className="text-lg font-semibold mt-2">${it.price}</p>
              </div>
              <div className="p-4 bg-gray-50 border-t flex items-center justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/guide/listings/edit/${it.id}`}>Edit</Link>
                </Button>
                <DeleteListingButton listingId={it.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-dashed border-2 rounded-lg">
            <p className="text-zinc-500">You haven&apos;t created any listings yet.</p>
        </div>
      )}
    </div>
  );
}
