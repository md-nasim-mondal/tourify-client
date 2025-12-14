/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

// Existing content of the file

import { serverFetch } from "@/lib/server-fetch";
import { envVariables } from "@/lib/env";
import CancelBookingButton from "@/components/modules/dashboard/CancelBookingButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  date: string;
  alreadyReviewed?: boolean;
  listing: {
    id: string;
    title: string;
    images: string[];
  };
  payment?: {
    id: string;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  } | null;
};

const statusColors = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-blue-500",
  CANCELLED: "bg-red-500",
  COMPLETED: "bg-green-500",
};

export default async function TouristBookingsPage() {
  const res = await serverFetch.get(`/bookings`);
  const result = await res.json();
  const bookings: Booking[] = result?.data || [];

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.date) >= now &&
      b.status !== "CANCELLED" &&
      b.status !== "COMPLETED"
  );
  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.date) < now ||
      b.status === "CANCELLED" ||
      b.status === "COMPLETED"
  );

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className='overflow-hidden'>
      <div className='flex items-center gap-4 p-4'>
        <Image
          src={booking.listing.images?.[0] || "/placeholder.png"}
          alt={booking.listing.title}
          width={96}
          height={96}
          className='w-24 h-24 object-cover rounded-lg'
        />
        <div className='grow'>
          <p className='font-semibold text-lg'>{booking.listing.title}</p>
          <p className='text-sm text-zinc-600 mt-1'>
            Date: {new Date(booking.date).toLocaleDateString()}
          </p>
          <Badge
            className={cn("mt-2 text-white", statusColors[booking.status])}>
            {booking.status}
          </Badge>
        </div>
        <div className='flex flex-col gap-2 shrink-0'>
          {(booking.status === "PENDING" || booking.status === "CONFIRMED") &&
            booking.payment?.status !== "PAID" && (
              <CancelBookingButton bookingId={booking.id} />
            )}
          {(booking.status === "CONFIRMED" || booking.status === "COMPLETED") &&
            booking.payment?.status !== "PAID" && (
              <Button asChild size='sm'>
                <Link href={`/dashboard/tourist/payments/${booking.id}`}>
                  Pay Now
                </Link>
              </Button>
            )}
          {booking.payment?.status === "PAID" && booking.payment?.id && (
            <a
              href={
                ((booking.payment as any)?.paymentGatewayData
                  ?.receiptUrl as string) ||
                `${envVariables.BASE_API_URL}/payments/${booking.payment.id}/receipt`
              }
              target='_blank'
              className='rounded bg-black text-white px-3 py-1 text-sm text-center'>
              Download Receipt
            </a>
          )}
          {booking.status === "COMPLETED" && booking.payment?.status === "PAID" && !booking.alreadyReviewed && (
            <Button asChild size='sm' variant='outline'>
              <Link href={`/dashboard/tourist/reviews/new/${booking.id}`}>
                Leave a Review
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>My Trips</h1>
        <p className='text-muted-foreground'>
          An overview of your booked tours.
        </p>
      </div>

      <div className='space-y-6'>
        <section>
          <h2 className='text-2xl font-semibold mb-4'>Upcoming Trips</h2>
          {upcomingBookings.length > 0 ? (
            <div className='space-y-4'>
              {upcomingBookings.map(renderBookingCard)}
            </div>
          ) : (
            <p className='text-zinc-500'>You have no upcoming trips.</p>
          )}
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Past Trips</h2>
          {pastBookings.length > 0 ? (
            <div className='space-y-4'>
              {pastBookings.map(renderBookingCard)}
            </div>
          ) : (
            <p className='text-zinc-500'>You have no past trips.</p>
          )}
        </section>
      </div>
    </div>
  );
}
