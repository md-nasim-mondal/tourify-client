"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

async function updateBookingAction(
  id: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return;
  await fetch(`${envVariables.BASE_API_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify({ status }),
  });
}

export default async function GuideDashboardHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const [bookingsRes, listingsRes] = await Promise.all([
    fetch(`${envVariables.BASE_API_URL}/bookings`, {
      cache: "no-store",
      headers: token ? { authorization: token } : undefined,
    }),
    fetch(`${envVariables.BASE_API_URL}/listings?mine=true`, {
      cache: "no-store",
      headers: token ? { authorization: token } : undefined,
    }),
  ]);
  const json = await bookingsRes.json();
  const listingsJson = await listingsRes.json();
  const bookings: {
    id: string;
    status: string;
    date: string;
    listing: { title: string };
  }[] = json?.data || [];
  const myListings: { id: string }[] = listingsJson?.data || [];

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>Guide Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>My Listings</h2>
          <p className='text-2xl font-bold'>{myListings.length}</p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Pending</h2>
          <p className='text-2xl font-bold'>{pending.length}</p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Confirmed</h2>
          <p className='text-2xl font-bold'>{confirmed.length}</p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Cancelled</h2>
          <p className='text-2xl font-bold'>{cancelled.length}</p>
        </div>
      </div>
      <h2 className='text-xl font-semibold mb-3'>Pending Requests</h2>
      <div className='space-y-3'>
        {pending.map((b) => (
          <div
            key={b.id}
            className='border rounded p-3 flex items-center justify-between'>
            <div>
              <p className='font-medium'>{b.listing?.title}</p>
              <p className='text-sm text-zinc-600'>
                {new Date(b.date).toDateString()}
              </p>
            </div>
            <div className='flex gap-2'>
              <form action={updateBookingAction.bind(null, b.id, "CONFIRMED")}>
                <button
                  type='submit'
                  className='rounded bg-green-600 text-white px-3 py-1'>
                  Accept
                </button>
              </form>
              <form action={updateBookingAction.bind(null, b.id, "CANCELLED")}>
                <button
                  type='submit'
                  className='rounded bg-red-600 text-white px-3 py-1'>
                  Decline
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
