"use client";
import { useEffect, useState } from "react";
import { Calendar, Users, Clock } from "lucide-react";
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
import { serverFetch } from "@/lib/server-fetch";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  listing: {
    id: string;
    price: number;
    duration: number;
    maxGroupSize: number;
    guide: { id: string };
    location?: string;
    meetingPoint?: string;
  };
  accessToken?: string;
}

export default function BookingWidget({
  listing,
  accessToken,
}: BookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [groupSize, setGroupSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<{ available: number; maxGroupSize: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date) {
        setAvailability(null);
        return;
      }
      try {
        // We reuse the existing endpoint structure but it now returns daily summary
        const res = await serverFetch.get(
          `/bookings/slots/${listing.id}?date=${date.toISOString()}`
        );
        if (res.ok) {
           const json = await res.json();
           // Backend returns { date, totalBooked, maxGroupSize, available }
           if (json.data) {
             setAvailability(json.data);
             // Reset group size to 1 if available > 0, else 0? 
             // Or ensure current groupSize isn't > available
             if (json.data.available < groupSize) {
                setGroupSize(Math.max(1, json.data.available)); 
             }
           }
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
        setAvailability(null);
      }
    };
    fetchAvailability();
  }, [date, listing.id]);

  const totalPrice = listing?.price * groupSize;
  const tourDuration = listing?.duration || 1;
  const maxBookable = availability ? availability.available : listing.maxGroupSize;

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!accessToken) {
      toast.error("You must be logged in to book.");
      return;
    }

    setIsLoading(true);
    try {
      // Set to noon to avoid timezone date shifting issues
      const bookingDate = new Date(date);
      bookingDate.setHours(12, 0, 0, 0);

      const bookingResult = await createBooking(
        {
          listingId: listing.id,
          date: bookingDate.toISOString(),
          groupSize: groupSize,
        },
        accessToken
      );

      if (!bookingResult.success) {
        toast.error(bookingResult.message || "Booking failed");
        setIsLoading(false);
        return;
      }

      toast.success("Booking request sent! Waiting for acceptance.");
      router.push("/dashboard/tourist/bookings");
    } catch {
      toast.error("An error occurred during booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='sticky top-24 border-none shadow-none lg:border lg:shadow-sm'>
      <CardContent className='p-0 lg:p-6'>
        <div className='hidden lg:block mb-6'>
          <div className='text-3xl font-bold text-primary'>
            ${listing.price}
          </div>
          <div className='text-gray-600'>per person</div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
             <Clock className="h-3 w-3" />
             {tourDuration} hours duration
          </div>
        </div>

        <div className="space-y-6">
            {/* Group Size */}
            <div className='space-y-2'>
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
                max={maxBookable}
                value={groupSize}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= maxBookable) {
                         setGroupSize(value);
                    }
                }}
                className='text-center w-20'
                />
                <Button
                size='icon'
                variant='outline'
                onClick={() => setGroupSize(Math.min(maxBookable, groupSize + 1))}
                disabled={groupSize >= maxBookable}>
                +
                </Button>
            </div>
            
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max capacity: {listing.maxGroupSize}</span>
                {availability && (
                    <span className={`font-medium ${availability.available === 0 ? 'text-destructive' : 'text-primary'}`}>
                        {availability.available > 0 ? `${availability.available} spots left` : 'Fully Booked'}
                    </span>
                )}
            </div>
            </div>

            {/* Date Picker */}
            <div className='space-y-2'>
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
                <PopoverContent className='w-auto p-0' align="start">
                <CalendarComponent
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            </div>

            {/* Price Summary */}
            <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div className='flex justify-between text-sm'>
                <span>${listing.price} × {groupSize} person(s)</span>
                <span>${listing.price * groupSize}</span>
            </div>
             <div className='flex justify-between text-sm text-gray-500'>
                <span>Duration</span>
                <span>{tourDuration} hours</span>
            </div>
            <div className='border-t pt-3'>
                <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span className='text-primary'>${totalPrice}</span>
                </div>
            </div>
            </div>

            {/* Booking Button */}
            <Button
            onClick={handleBooking}
            disabled={!date || isLoading || (availability ? availability.available === 0 : false)}
            className='w-full'
            size='lg'>
            {isLoading ? "Processing..." : (availability && availability.available === 0 ? "Fully Booked" : "Request Booking")}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
