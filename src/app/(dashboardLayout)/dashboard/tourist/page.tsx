"use server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function cancelBookingAction(id: string) {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return;
  await fetch(`${API_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify({ status: "CANCELLED" }),
  });
}

async function payBookingAction(id: string) {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return;
  const initRes = await fetch(`${API_URL}/payments/initiate`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ bookingId: id }),
  });
  const initJson = await initRes.json();
  const paymentId: string | undefined = initJson?.data?.id;
  if (!paymentId) return;
  await fetch(`${API_URL}/payments/confirm`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ paymentId }),
  });
}

export default async function TouristDashboardHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${API_URL}/bookings`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const bookings: {
    id: string;
    status: string;
    date: string;
    listing: { title: string };
  }[] = json?.data || [];

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>My Trips</h1>
      <div className='space-y-3'>
        {bookings.map((b) => (
          <form
            key={b.id}
            action={cancelBookingAction.bind(null, b.id)}
            className='border rounded p-3 flex items-center justify-between'>
            <div>
              <p className='font-medium'>{b.listing?.title}</p>
              <p className='text-sm text-zinc-600'>
                {new Date(b.date).toDateString()}
              </p>
              <p className='text-xs'>Status: {b.status}</p>
            </div>
            {b.status === "PENDING" && (
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='rounded bg-red-600 text-white px-3 py-1'>
                  Cancel
                </button>
                <form action={payBookingAction.bind(null, b.id)}>
                  <button
                    type='submit'
                    className='rounded bg-blue-600 text-white px-3 py-1'>
                    Pay
                  </button>
                </form>
              </div>
            )}
          </form>
        ))}
      </div>
    </div>
  );
}
