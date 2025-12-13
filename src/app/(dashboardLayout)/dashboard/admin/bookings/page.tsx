import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

async function updateBookingStatusAction(id: string, formData: FormData) {
  "use server";
  const token = (await cookies()).get("accessToken")?.value;
  const status = String(formData.get("status") || "CANCELLED");
  if (!token) return;
  await fetch(`${envVariables.BASE_API_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ status }),
  });
}

export default async function AdminBookingsPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/bookings?limit=50`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const bookings: { id: string; status: string; listing: { title: string } }[] = json?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{b.listing?.title}</p>
              <p className="text-xs">Status: {b.status}</p>
            </div>
            <form action={updateBookingStatusAction.bind(null, b.id)} className="flex gap-2">
              <select name="status" defaultValue={b.status} className="rounded border px-2 py-1">
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <button type="submit" className="rounded bg-black text-white px-3 py-1">Update</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
