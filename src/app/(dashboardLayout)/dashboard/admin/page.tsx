"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

export default async function AdminDashboardHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const headers = token ? { authorization: token } : undefined;
  const [usersRes, listingsRes, bookingsRes, paymentsRes] = await Promise.all([
    fetch(`${envVariables.BASE_API_URL}/users?limit=5`, {
      cache: "no-store",
      headers,
    }),
    fetch(`${envVariables.BASE_API_URL}/listings?limit=5`, {
      cache: "no-store",
    }),
    fetch(`${envVariables.BASE_API_URL}/bookings?limit=5`, {
      cache: "no-store",
      headers,
    }),
    fetch(`${envVariables.BASE_API_URL}/payments?limit=100`, {
      cache: "no-store",
      headers,
    }),
  ]);
  const usersJson = await usersRes.json();
  const listingsJson = await listingsRes.json();
  const bookingsJson = await bookingsRes.json();
  const paymentsJson = await paymentsRes.json();
  const users: { id: string; email: string; name: string; role: string }[] =
    usersJson?.data || [];
  const listings: { id: string; title: string; location: string }[] =
    listingsJson?.data || [];
  const bookings: { id: string; status: string; listing: { title: string } }[] =
    bookingsJson?.data || [];
  const payments: { id: string; status: string; amount?: number }[] =
    paymentsJson?.data || [];

  const totalUsers = usersJson?.meta?.total || users.length;
  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  const totalListings = listingsJson?.meta?.total || listings.length;
  const bookingCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const totalBookings = bookingsJson?.meta?.total || bookings.length;
  const totalPayments = paymentsJson?.meta?.total || payments.length;
  const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Users</h2>
          <p className='text-2xl font-bold'>{totalUsers}</p>
          <p className='text-xs text-zinc-600'>
            Admin: {roleCounts["ADMIN"] || 0} • Guide:{" "}
            {roleCounts["GUIDE"] || 0} • Tourist: {roleCounts["TOURIST"] || 0}
          </p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Listings</h2>
          <p className='text-2xl font-bold'>{totalListings}</p>
          <p className='text-xs text-zinc-600'>
            Published tours in the platform
          </p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Bookings</h2>
          <p className='text-2xl font-bold'>{totalBookings}</p>
          <p className='text-xs text-zinc-600'>
            Confirmed: {bookingCounts["CONFIRMED"] || 0} • Pending:{" "}
            {bookingCounts["PENDING"] || 0}
          </p>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold'>Revenue</h2>
          <p className='text-2xl font-bold'>${revenue}</p>
          <p className='text-xs text-zinc-600'>Payments: {totalPayments}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='border rounded p-4'>
          <h2 className='font-semibold mb-2'>Recent Users</h2>
          <ul className='space-y-2'>
            {users.map((u) => (
              <li key={u.id} className='text-sm'>
                {u.name} — {u.email} ({u.role})
              </li>
            ))}
          </ul>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold mb-2'>Recent Listings</h2>
          <ul className='space-y-2'>
            {listings.map((l) => (
              <li key={l.id} className='text-sm'>
                {l.title} — {l.location}
              </li>
            ))}
          </ul>
        </div>
        <div className='border rounded p-4'>
          <h2 className='font-semibold mb-2'>Recent Bookings</h2>
          <ul className='space-y-2'>
            {bookings.map((b) => (
              <li key={b.id} className='text-sm'>
                {b.listing?.title} — {b.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
