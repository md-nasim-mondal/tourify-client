"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function createListingAction(formData: FormData) {
  'use server'
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return;
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const location = String(formData.get("location") || "");
  const price = Number(formData.get("price") || 0);
  const images = formData.getAll("images") as File[];

  const multipart = new FormData();
  images.forEach((file) => multipart.append("images", file));
  multipart.append("data", JSON.stringify({ title, description, location, price }));

  await fetch(`${API_URL}/listings`, {
    method: "POST",
    headers: { authorization: token },
    body: multipart,
  });
}

export default async function GuideListingsPage() {
  const res = await fetch(`${API_URL}/listings`, { cache: "no-store" });
  const json = await res.json();
  const listings: { id: string; title: string; location: string; price: number }[] = json?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">My Listings</h1>
      <form action={createListingAction} className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-4 mb-6">
        <input name="title" placeholder="Title" className="rounded border px-3 py-2" required />
        <input name="location" placeholder="Location" className="rounded border px-3 py-2" required />
        <input name="price" type="number" placeholder="Price" className="rounded border px-3 py-2" required />
        <textarea name="description" placeholder="Description" className="rounded border px-3 py-2 md:col-span-2" required />
        <input name="images" type="file" multiple className="md:col-span-2" />
        <button type="submit" className="rounded bg-black text-white px-4 py-2 md:col-span-2">Create Listing</button>
      </form>

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
