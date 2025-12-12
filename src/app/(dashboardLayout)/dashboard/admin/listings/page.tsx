/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVariables } from "@/lib/env";
import { getListings } from "@/services/listing/listing.service";
import { cookies } from "next/headers";

async function updateListingStatusAction(id: string, formData: FormData) {
  "use server";
  const token = (await cookies()).get("accessToken")?.value;
  const status = String(formData.get("status") || "ACTIVE");
  if (!token) return;
  await fetch(`${envVariables.BASE_API_URL}/listings/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ status }),
  });
}

export default async function AdminListingsPage() {
  const { data: listings } = await getListings();

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>Manage Listings</h1>
      <div className='space-y-3'>
        {listings?.map((l: any) => (
          <div
            key={l.id}
            className='border rounded p-3 flex items-center justify-between'>
            <div>
              <p className='font-medium'>{l.title}</p>
              <p className='text-sm text-zinc-600'>{l.location}</p>
              <p className='text-xs'>Status: {l.status || "ACTIVE"}</p>
            </div>
            <form
              action={updateListingStatusAction.bind(null, l.id)}
              className='flex gap-2'>
              <select
                name='status'
                defaultValue={l.status || "ACTIVE"}
                className='rounded border px-2 py-1'>
                <option value='ACTIVE'>ACTIVE</option>
                <option value='BLOCKED'>BLOCKED</option>
              </select>
              <button
                type='submit'
                className='rounded bg-black text-white px-3 py-1'>
                Update
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
