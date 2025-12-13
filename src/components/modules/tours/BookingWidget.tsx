"use client";
import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
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
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<Record<number, number>>({});
  const router = useRouter();

  // Fetch guide's booked dates (to disable full days if we implemented that check)
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!listing.guide?.id) return;
      // We keep this for now, though logic might need adjustment if we only care about slots.
      // Ideally "booked dates" implies "NO availability at all".
    };
    // fetchBookedDates(); // simplified for now to focus on slots
  }, [accessToken, listing?.guide?.id]);

  // Fetch slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) {
        setBookedSlots({});
        return;
      }
      try {
        const res = await serverFetch.get(
          `/bookings/slots/${listing.id}?date=${date.toISOString()}`
        );
        if (res.ok) {
           const json = await res.json();
           setBookedSlots(json.data || {});
        }
      } catch (error) {
        console.error("Failed to fetch slots", error);
      }
    };
    fetchSlots();
    setSelectedHour(null); // Reset hour when date changes
  }, [date, listing.id]);

  const totalPrice = listing?.price * groupSize;

  const handleBooking = async () => {
    if (!date || selectedHour === null) {
      toast.error("Please select a date and time");
      return;
    }
    if (!accessToken) {
      toast.error("You must be logged in to book.");
      return;
    }

    setIsLoading(true);
    try {
      const bookingDate = new Date(date);
      bookingDate.setHours(selectedHour, 0, 0, 0);

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

  const getSlotStatus = (hour: number) => {
    const usage = bookedSlots[hour] || 0;
    const remaining = listing.maxGroupSize - usage;
    return {
       available: remaining >= groupSize,
       remaining
    };
  };

  // Generate 7 AM to 5 PM slots
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 7);

  return (
    <Card className='sticky top-24 border-none shadow-none lg:border lg:shadow-sm'>
      <CardContent className='p-0 lg:p-6'>
        <div className='hidden lg:block mb-6'>
          <div className='text-3xl font-bold text-primary'>
            ${listing.price}
          </div>
          <div className='text-gray-600'>per person</div>
        </div>

        {/* Mobile Price Header (Sticky?) - keeping simple for now */}

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
                max={listing.maxGroupSize}
                value={groupSize}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= listing.maxGroupSize) {
                         setGroupSize(value);
                         setSelectedHour(null); // Reset selection if size changes (capacity might fail)
                    }
                }}
                className='text-center w-20'
                />
                <Button
                size='icon'
                variant='outline'
                onClick={() => setGroupSize(Math.min(listing.maxGroupSize, groupSize + 1))}
                disabled={groupSize >= listing.maxGroupSize}>
                +
                </Button>
            </div>
            <p className='text-sm text-gray-500'>
                Max capacity: {listing.maxGroupSize}
            </p>
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

            {/* Time Slots */}
            {date && (
                <div className='space-y-3 animate-in fade-in slide-in-from-top-4 duration-300'>
                    <Label>Select Time (7 AM - 5 PM)</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((hour) => {
                            const { available, remaining } = getSlotStatus(hour);
                            const isSelected = selectedHour === hour;
                            
                            // Format hour (e.g., 9:00 AM)
                            const timeLabel = new Date(new Date().setHours(hour, 0)).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit'
                            });

                            return (
                                <button
                                    key={hour}
                                    onClick={() => available && setSelectedHour(hour)}
                                    disabled={!available}
                                    className={`
                                        flex flex-col items-center justify-center p-2 rounded-md border text-sm transition-all
                                        ${isSelected 
                                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-1' 
                                            : 'border-input hover:bg-accent hover:text-accent-foreground'}
                                        ${!available && 'opacity-50 cursor-not-allowed bg-muted'}
                                    `}
                                >
                                    <span className="font-medium">{timeLabel}</span>
                                    {available ? (
                                        <span className="text-[10px] text-muted-foreground">{remaining} left</span>
                                    ) : (
                                        <span className="text-[10px] text-destructive">Full</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Price Summary */}
            <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div className='flex justify-between text-sm'>
                <span>${listing.price} × {groupSize} person(s)</span>
                <span>${listing.price * groupSize}</span>
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
            disabled={!date || selectedHour === null || isLoading}
            className='w-full'
            size='lg'>
            {isLoading ? "Processing..." : "Request Booking"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
