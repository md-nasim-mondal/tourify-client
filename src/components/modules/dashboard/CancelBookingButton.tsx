"use client";

import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/services/booking/updateBookingStatus";
import { toast } from "sonner";
import { useState } from "react";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      setIsLoading(true);
      const result = await updateBookingStatus(bookingId, "CANCELLED");
      if (result.success) {
        toast.success("Booking cancelled successfully.");
      } else {
        toast.error(result.message || "Failed to cancel booking.");
      }
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleCancel}
      disabled={isLoading}
    >
      {isLoading ? "Cancelling..." : "Cancel Booking"}
    </Button>
  );
}
