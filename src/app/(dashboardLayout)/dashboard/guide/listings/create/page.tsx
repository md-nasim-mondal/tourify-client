"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

async function createListingAction(formData: FormData) {
  "use server";
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

  await fetch(`${envVariables.BASE_API_URL}/listings`, {
    method: "POST",
    headers: { authorization: token },
    body: multipart,
  });
}

export default async function GuideCreateListingPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Create Listing</h1>
      <form action={createListingAction} className="grid grid-cols-1 gap-3 border rounded p-4">
        <input name="title" placeholder="Title" className="rounded border px-3 py-2" required />
        <input name="location" placeholder="Location" className="rounded border px-3 py-2" required />
        <input name="price" type="number" placeholder="Price" className="rounded border px-3 py-2" required />
        <textarea name="description" placeholder="Description" className="rounded border px-3 py-2" required />
        <input name="images" type="file" multiple />
        <button type="submit" className="rounded bg-black text-white px-4 py-2">Create</button>
      </form>
    </div>
  );
}
