"use client";

import { Button } from "@/components/ui/button";
import { deleteListing } from "@/services/listing/deleteListing";
import { toast } from "sonner";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      const result = await deleteListing(listingId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
}
