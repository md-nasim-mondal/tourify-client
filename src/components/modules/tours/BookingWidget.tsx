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
import { useCart } from "@/context/CartContext";

interface BookingWidgetProps {
  listing: {
    id: string;
    price: number;
    duration: number;
    maxGroupSize: number;
    guide: { id: string };
    location?: string;
    meetingPoint?: string;
  } & any;
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
  
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isapplyingCoupon, setIsApplyingCoupon] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date) {
        setAvailability(null);
        return;
      }
      try {
        const res = await serverFetch.get(
          `/bookings/slots/${listing.id}?date=${date.toISOString()}`
        );
        if (res.ok) {
           const json = await res.json();
           if (json.data) {
             setAvailability(json.data);
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

  const basePrice = listing?.price * groupSize;
  const totalDiscount = (basePrice * discount) / 100;
  const totalPrice = basePrice - totalDiscount;
  const tourDuration = listing?.duration || 1;
  const maxBookable = availability ? availability.available : listing.maxGroupSize;

  const handleApplyCoupon = () => {
     setIsApplyingCoupon(true);
     setCouponMessage(null);
     
     // Mock Validation
     setTimeout(() => {
        if (couponCode.toUpperCase() === "SAVE10") {
           setDiscount(10);
           setCouponMessage({ type: 'success', text: 'Coupon applied! 10% off.' });
        } else if (couponCode.toUpperCase() === "SUMMER20") {
           setDiscount(20);
           setCouponMessage({ type: 'success', text: 'Coupon applied! 20% off.' });
        } else {
           setDiscount(0);
           setCouponMessage({ type: 'error', text: 'Invalid coupon code.' });
        }
        setIsApplyingCoupon(false);
     }, 800);
  };

  const handleAddToCart = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    addToCart({
      listingId: listing.id,
      title: listing.title || "Tour Booking",
      image: listing.images?.[0] || "/placeholder-tour.jpg",
      location: listing.location || "",
      price: listing.price,
      date: date.toISOString(),
      groupSize,
      totalPrice,
      tourDuration
    });
    toast.success("Added to cart!");
  };

  const handleBookNow = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!accessToken) {
      toast.error("You must be logged in to book.");
      router.push("/login?redirect=/tours/" + listing.id);
      return;
    }

    setIsLoading(true);
    try {
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

      toast.success("Booking request sent successfully!");
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
          <div className='flex items-baseline gap-2'>
             <span className='text-3xl font-bold text-primary'>${listing.price}</span>
             <span className='text-gray-600 font-medium'>per person</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
             <Clock className="h-4 w-4" />
             {tourDuration} hours duration
          </div>
        </div>

        <div className="space-y-6">
            {/* Group Size */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2 font-semibold'>
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
                  className='text-center w-20 font-semibold'
                  />
                  <Button
                  size='icon'
                  variant='outline'
                  onClick={() => setGroupSize(Math.min(maxBookable, groupSize + 1))}
                  disabled={groupSize >= maxBookable}>
                  +
                  </Button>
               </div>
               
               <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Max capacity: {listing.maxGroupSize}</span>
                  {availability && (
                        <span className={`font-medium ${availability.available === 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                           {availability.available > 0 ? `${availability.available} spots left` : 'Fully Booked'}
                        </span>
                  )}
               </div>
            </div>

            {/* Date Picker */}
            <div className='space-y-3'>
               <Label className="font-semibold">Select Date</Label>
               <Popover>
                  <PopoverTrigger asChild>
                  <Button
                     variant='outline'
                     className='w-full justify-start text-left font-normal border-input hover:bg-accent/50'>
                     <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
                     {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align="start">
                  <CalendarComponent
                     mode='single'
                     selected={date}
                     onSelect={setDate}
                     disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                     initialFocus
                     className="rounded-md border shadow-md"
                  />
                  </PopoverContent>
               </Popover>
            </div>

            {/* Coupon Section */}
            <div className="space-y-3 border-t border-border pt-4">
               <Label className="font-semibold text-sm">Have a coupon?</Label>
               <div className="flex gap-2">
                  <Input 
                     placeholder="Coupon code" 
                     value={couponCode} 
                     onChange={(e) => setCouponCode(e.target.value)}
                     className="uppercase"
                  />
                  <Button 
                     variant="secondary" 
                     onClick={handleApplyCoupon} 
                     disabled={!couponCode || isapplyingCoupon || discount > 0}
                  >
                     {isapplyingCoupon ? "..." : "Apply"}
                  </Button>
               </div>
               {couponMessage && (
                  <p className={`text-xs font-medium px-1 ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
                     {couponMessage.text}
                  </p>
               )}
            </div>

            {/* Price Summary */}
            <div className='space-y-3 rounded-xl bg-gray-50/80 dark:bg-slate-900/50 p-5 border border-border/50'>
               <div className='flex justify-between text-sm'>
                  <span className="text-gray-600">${listing.price} × {groupSize} person(s)</span>
                  <span className="font-medium">${basePrice.toFixed(2)}</span>
               </div>
               {discount > 0 && (
                  <div className='flex justify-between text-sm text-emerald-600 animate-in slide-in-from-top-1'>
                     <span>Discount ({discount}%)</span>
                     <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
               )}
               <div className='flex justify-between text-sm text-gray-500'>
                  <span>Service fee</span>
                  <span>$0.00</span>
               </div>
               <div className='border-t border-gray-200 mt-2 pt-3'>
                  <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span className='text-primary'>${totalPrice.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  disabled={!date || isLoading || (availability ? availability.available === 0 : false)}
                  className="flex-1 text-base font-semibold h-12"
                >
                  Add to Cart
                </Button>
                
                <Button
                  onClick={handleBookNow}
                  disabled={!date || isLoading || (availability ? availability.available === 0 : false)}
                  className={`flex-1 text-base font-semibold h-12 transition-all ${
                     isLoading ? "opacity-80" : "hover:scale-[1.02] hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                     <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                        Booking...
                     </span>
                  ) : (
                     availability && availability.available === 0 ? "Fully Booked" : "Book Now"
                  )}
                </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
               You won't be charged yet
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
