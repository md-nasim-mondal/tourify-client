import ReviewForm from "@/components/modules/reviews/ReviewForm";
import { serverFetch } from "@/lib/server-fetch";
import { notFound } from "next/navigation";

async function getBookingDetails(id: string) {
    const res = await serverFetch.get(`/bookings/${id}`); // Assuming a GET /bookings/:id endpoint exists
    const result = await res.json();
    if (result.success) {
        return result.data;
    }
    return notFound();
}

export default async function NewReviewPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const booking = await getBookingDetails((await params).bookingId);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="border rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-2">Leave a Review</h1>
                <p className="text-muted-foreground mb-6">You are reviewing your tour: <span className="font-semibold">{booking.listing.title}</span></p>
                <ReviewForm booking={booking} />
            </div>
        </div>
    );
}
