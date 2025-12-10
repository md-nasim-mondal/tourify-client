"use client";

import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/services/booking/updateBookingStatus";
import { toast } from "sonner";
import { useState } from "react";

export default function BookingActionButtons({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState<"confirm" | "cancel" | null>(null);

  const handleUpdateStatus = async (status: "CONFIRMED" | "CANCELLED") => {
    setIsLoading(status === "CONFIRMED" ? "confirm" : "cancel");
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsLoading(null);
  };

  return (
    <div className='flex gap-2'>
      <Button
        size="sm"
        onClick={() => handleUpdateStatus("CONFIRMED")}
        disabled={!!isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading === "confirm" ? "Accepting..." : "Accept"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleUpdateStatus("CANCELLED")}
        disabled={!!isLoading}
      >
        {isLoading === "cancel" ? "Declining..." : "Decline"}
      </Button>
    </div>
  );
}
