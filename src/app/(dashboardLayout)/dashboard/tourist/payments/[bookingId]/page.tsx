import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import { Button } from "@/components/ui/button";
import { initiatePayment } from "@/services/payment/payment.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

async function getBookingDetails(id: string) {
    const res = await serverFetch.get(`/bookings/${id}`);
    const result = await res.json();
    if (result.success) {
        return result.data;
    }
    return notFound();
}

export default async function PaymentPage({ params }: { params: { bookingId: string } }) {
    const booking = await getBookingDetails(params.bookingId);
    const totalPrice = booking.listing.price; // Assuming price is per booking for simplicity

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Payment</CardTitle>
                    <CardDescription>Review your booking details and proceed to payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tour</span>
                        <span className="font-semibold">{booking.listing.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                     <div className="border-t my-4"></div>
                    <div className="flex justify-between items-center text-xl">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">${totalPrice}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <form action={initiatePayment}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="amount" value={totalPrice} />
                        <Button type="submit" className="w-full" size="lg">
                            Proceed to Stripe
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
