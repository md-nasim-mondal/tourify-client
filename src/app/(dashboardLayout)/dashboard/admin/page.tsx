export const dynamic = 'force-dynamic';
import { serverFetch } from "@/lib/server-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardHomePage() {
  const [usersRes, listingsRes, bookingsRes, paymentsRes] = await Promise.all([
    serverFetch.get(`/users?limit=5`),
    serverFetch.get(`/listings?limit=5`),
    serverFetch.get(`/bookings?limit=5`),
    serverFetch.get(`/payments?limit=100`),
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

  const totalUsers = usersJson?.meta?.total || 0;
  const totalListings = listingsJson?.meta?.total || 0;
  const totalBookings = bookingsJson?.meta?.total || 0;
  const totalPayments = paymentsJson?.meta?.total || 0;
  const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <p className='text-muted-foreground'>
          Global overview of the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{totalListings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>${revenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Recent Users</CardTitle>
            <Button asChild variant='outline' size='sm'>
              <Link href='/dashboard/admin/users'>Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {users.map((u) => (
                <li key={u.id} className='text-sm'>
                  {u.name}{" "}
                  <span className='text-muted-foreground'>({u.role})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Recent Listings</CardTitle>
            <Button asChild variant='outline' size='sm'>
              <Link href='/dashboard/admin/listings'>Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {listings.map((l) => (
                <li key={l.id} className='text-sm truncate'>
                  {l.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className='lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Recent Bookings</CardTitle>
            <Button asChild variant='outline' size='sm'>
              <Link href='/dashboard/admin/bookings'>Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {bookings.map((b) => (
                <li key={b.id} className='text-sm truncate'>
                  {b.listing?.title} -{" "}
                  <span className='font-semibold'>{b.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
