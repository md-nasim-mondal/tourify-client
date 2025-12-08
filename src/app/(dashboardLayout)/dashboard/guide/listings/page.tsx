"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
import Link from "next/link";

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link href="/dashboard/guide/listings/create" className="rounded bg-black text-white px-4 py-2">Create Listing</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((it) => (
          <div key={it.id} className="border rounded p-3">
            <p className="font-medium">{it.title}</p>
            <p className="text-sm text-zinc-600">{it.location}</p>
            <p className="text-sm">${it.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
