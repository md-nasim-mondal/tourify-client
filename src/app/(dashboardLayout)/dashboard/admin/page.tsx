"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default async function AdminDashboardHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const headers = token ? { authorization: token } : undefined;
  const [usersRes, listingsRes, bookingsRes] = await Promise.all([
    fetch(`${API_URL}/users?limit=5`, { cache: "no-store", headers }),
    fetch(`${API_URL}/listings?limit=5`, { cache: "no-store" }),
    fetch(`${API_URL}/bookings?limit=5`, { cache: "no-store", headers }),
  ]);
  const usersJson = await usersRes.json();
  const listingsJson = await listingsRes.json();
  const bookingsJson = await bookingsRes.json();
  const users: { id: string; email: string; name: string; role: string }[] = usersJson?.data || [];
  const listings: { id: string; title: string; location: string }[] = listingsJson?.data || [];
  const bookings: { id: string; status: string; listing: { title: string } }[] = bookingsJson?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Recent Users</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id} className="text-sm">{u.name} — {u.email} ({u.role})</li>
            ))}
          </ul>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Recent Listings</h2>
          <ul className="space-y-2">
            {listings.map((l) => (
              <li key={l.id} className="text-sm">{l.title} — {l.location}</li>
            ))}
          </ul>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Recent Bookings</h2>
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="text-sm">{b.listing?.title} — {b.status}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
