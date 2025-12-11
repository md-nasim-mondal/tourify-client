"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { createBooking } from "@/services/booking/booking.service";
import { envVariables } from "@/lib/env";
import { initiatePaymentClient } from "@/services/payment/initiatePayment";

interface BookingWidgetProps {
  listing: {
    id: string;
    price: number;
    maxGroupSize: number;
    guide: { id: string };
    location?: string;
    meetingPoint?: string;
  };
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [groupSize, setGroupSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());

  // Fetch guide availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(
          `${envVariables.BASE_API_URL}/availabilities?guideId=${listing.guide.id}&isAvailable=true&limit=100`,
          { credentials: "include" }
        );
        const json = await res.json();
        const dates = new Set<string>();
        (json?.data || []).forEach((slot: { date: string }) => {
          const d = new Date(slot.date);
          d.setHours(0, 0, 0, 0);
          dates.add(d.toISOString());
        });
        setAvailableDates(dates);
      } catch {
        // silent fail, calendar will allow any future date
      }
    };
    fetchAvailability();
  }, [listing.guide?.id]);

  const totalPrice = listing.price * groupSize;

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Booking
      const bookingResult = await createBooking({
        listingId: listing.id,
        date: date.toISOString(),
      });

      if (!bookingResult.success) {
        toast.error(bookingResult.message || "Booking failed");
        setIsLoading(false);
        return;
      }

      toast.success(
        "Booking request sent successfully! Redirecting to payment..."
      );

      // 2. Initiate Payment
      const paymentResult = await initiatePaymentClient({
        bookingId: bookingResult.data.id,
        amount: totalPrice,
      });

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentResult.paymentUrl;
      } else {
        toast.error(paymentResult.message || "Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Booking or Payment initiation error:", error);
      toast.error(
        "An error occurred during booking or payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='sticky top-24'>
      <CardContent className='p-6'>
        <div className='mb-6'>
          <div className='text-3xl font-bold text-primary'>
            ${listing.price}
          </div>
          <div className='text-gray-600'>per person</div>
        </div>

        {/* Date Picker */}
        <div className='mb-4 space-y-2'>
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal'>
                <Calendar className='mr-2 h-4 w-4' />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <CalendarComponent
                mode='single'
                selected={date}
                onSelect={setDate}
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dd = new Date(d);
                  dd.setHours(0, 0, 0, 0);
                  const iso = dd.toISOString();
                  const isPast = dd < today;
                  const hasAvailability =
                    availableDates.size === 0 || availableDates.has(iso);
                  return isPast || !hasAvailability;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Group Size */}
        <div className='mb-4 space-y-2'>
          <Label className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Group Size
          </Label>
          <div className='flex items-center gap-4'>
            <Button
              size='icon'
              variant='outline'
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
              disabled={groupSize <= 1}>
              -
            </Button>
            <Input
              type='number'
              min='1'
              max={listing.maxGroupSize}
              value={groupSize}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (
                  !isNaN(value) &&
                  value >= 1 &&
                  value <= listing.maxGroupSize
                ) {
                  setGroupSize(value);
                }
              }}
              className='text-center'
            />
            <Button
              size='icon'
              variant='outline'
              onClick={() =>
                setGroupSize(Math.min(listing.maxGroupSize, groupSize + 1))
              }
              disabled={groupSize >= listing.maxGroupSize}>
              +
            </Button>
          </div>
          <p className='text-sm text-gray-500'>
            Maximum group size: {listing.maxGroupSize}
          </p>
        </div>

        {/* Price Summary */}
        <div className='mb-6 space-y-3 rounded-lg bg-gray-50 p-4'>
          <div className='flex justify-between'>
            <span>
              ${listing.price} × {groupSize} person(s)
            </span>
            <span>${listing.price * groupSize}</span>
          </div>
          <div className='border-t pt-3'>
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span className='text-primary'>${totalPrice}</span>
            </div>
          </div>
          {availableDates.size > 0 && (
            <p className='text-xs text-gray-500'>
              Only available dates are selectable based on guide schedule.
            </p>
          )}
        </div>

        {/* Booking Button */}
        <Button
          onClick={handleBooking}
          disabled={!date || isLoading}
          className='w-full'
          size='lg'>
          {isLoading ? "Processing..." : "Book Now"}
        </Button>

        {/* Features */}
        <div className='mt-6 space-y-3'>
          <div className='flex items-center gap-2 text-sm'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <span>Secure payment</span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <span>Free cancellation up to 24 hours</span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <span>Verified guide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
