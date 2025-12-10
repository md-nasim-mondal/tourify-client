import { serverFetch } from "@/lib/server-fetch";
import BookingActionButtons from "@/components/modules/dashboard/BookingActionButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export const dynamic = "force-dynamic";

type Booking = {
  id: string;
  status: string;
  date: string;
  listing: { title: string };
  user: { name: string; photo: string };
};

export default async function GuideDashboardHomePage() {
  const [bookingsRes, listingsRes] = await Promise.all([
    serverFetch.get(`/bookings`),
    serverFetch.get(`/listings?mine=true`),
  ]);

  const bookingsResult = await bookingsRes.json();
  const listingsResult = await listingsRes.json();

  const bookings: Booking[] = bookingsResult?.data || [];
  const myListings: { id: string }[] = listingsResult?.data || [];

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>Guide Dashboard</h1>
        <p className='text-muted-foreground'>An overview of your activity.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{myListings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{confirmed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancelled Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{cancelled.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {pending.length > 0 ? (
              pending.map((b) => (
                <div
                  key={b.id}
                  className='border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    <Image
                      src={b.user?.photo || "/default-avatar.png"}
                      alt='User'
                      className='w-10 h-10 rounded-full'
                    />
                    <div>
                      <p className='font-medium'>
                        {b.user?.name || "A user"} booked:{" "}
                        <span className='font-semibold'>
                          {b.listing?.title}
                        </span>
                      </p>
                      <p className='text-sm text-zinc-600'>
                        On: {new Date(b.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='shrink-0'>
                    <BookingActionButtons bookingId={b.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-10'>
                <p className='text-zinc-500'>
                  You have no pending booking requests.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
