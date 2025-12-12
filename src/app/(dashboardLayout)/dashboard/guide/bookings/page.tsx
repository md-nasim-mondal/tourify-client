/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { updateBookingStatus } from "@/services/booking/updateBookingStatus";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { envVariables } from "@/lib/env";
export const dynamic = "force-dynamic";

async function acceptBookingAction(bookingId: string) {
  "use server";
  await updateBookingStatus(bookingId, "CONFIRMED");
  revalidatePath("/dashboard/guide/bookings");
}

async function declineBookingAction(bookingId: string) {
  "use server";
  await updateBookingStatus(bookingId, "CANCELLED");
  revalidatePath("/dashboard/guide/bookings");
}

async function completeBookingAction(bookingId: string) {
  "use server";
  await updateBookingStatus(bookingId, "COMPLETED");
  revalidatePath("/dashboard/guide/bookings");
}

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  date: string;
  listing: { id: string; title: string; images: string[] };
  tourist: { name?: string; photo?: string; email?: string };
  payment?: { id: string; status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" } | null;
};

const statusColors = {
  PENDING: "bg-yellow-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  COMPLETED: "bg-green-600 text-white",
};

export default async function GuideBookingsPage() {
  const res = await serverFetch.get(`/bookings`);
  const json = await res.json();
  const bookings: Booking[] = json?.data || [];

  const renderRow = (b: Booking) => {
    const canComplete =
      b.status === "CONFIRMED" &&
      new Date(b.date).getTime() < new Date().getTime();
    return (
      <div
        key={b.id}
        className='border rounded-lg p-4 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Image
            src={b.listing.images?.[0] || "/default-avatar.png"}
            alt='tour'
            width={64}
            height={64}
            className='w-16 h-16 rounded-md object-cover'
          />
          <div>
            <p className='font-medium'>{b.listing.title}</p>
            <p className='text-sm text-zinc-600'>
              With: {b.tourist?.name || "A tourist"}
            </p>
            <p className='text-sm text-zinc-600'>
              On: {new Date(b.date).toLocaleDateString()}
            </p>
            <span
              className={cn(
                "inline-block mt-2 px-2 py-1 text-xs rounded",
                statusColors[b.status]
              )}>
              {b.status}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {b.payment?.status === "PAID" && b.payment?.id && (
            <a
              href={
                ((b.payment as any)?.paymentGatewayData?.receiptUrl as string) ||
                `${envVariables.BASE_API_URL}/payments/${b.payment.id}/receipt`
              }
              target='_blank'
              className='rounded bg-black text-white px-3 py-1 text-sm'
            >
              Download Receipt
            </a>
          )}
          {b.status === "PENDING" && (
            <>
              <form action={acceptBookingAction.bind(null, b.id)}>
                <Button size='sm' className='bg-green-600 hover:bg-green-700'>
                  Accept
                </Button>
              </form>
              <form action={declineBookingAction.bind(null, b.id)}>
                <Button size='sm' variant='destructive'>
                  Decline
                </Button>
              </form>
            </>
          )}
          {canComplete && (
            <form action={completeBookingAction.bind(null, b.id)}>
              <Button size='sm' variant='outline'>
                Mark Completed
              </Button>
            </form>
          )}
          <Button asChild size='sm' variant='ghost'>
            <Link href={`/tours/${b.listing?.id}`}>View Listing</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 space-y-6'>
      <h1 className='text-2xl font-semibold'>My Bookings</h1>
      <Card className='p-4 space-y-3'>
        {bookings.length ? (
          bookings.map(renderRow)
        ) : (
          <p className='text-zinc-500'>No bookings found.</p>
        )}
      </Card>
    </div>
  );
}
