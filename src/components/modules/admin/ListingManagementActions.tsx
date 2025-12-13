
"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, Trash } from "lucide-react";
import { toast } from "sonner";
import { updateListingStatus } from "@/services/listing/updateListingStatus";
import { deleteListing } from "@/services/listing/deleteListing";

export default function ListingManagementActions({ listing }: { listing: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleStatusChange = async (newStatus: "ACTIVE" | "BLOCKED") => {
    try {
      const res = await updateListingStatus(listing.id, newStatus);
      if (res.success) {
        toast.success(`Listing ${newStatus.toLowerCase()} successfully`);
        setDropdownOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
      if(!confirm("Are you sure you want to delete this listing?")) return;
      try {
          const res = await deleteListing(listing.id);
          if (res.success) {
            toast.success("Listing deleted successfully");
            setDropdownOpen(false);
          } else {
            toast.error(res.message);
          }
      } catch (error) {
          toast.error("Failed to delete listing");
      }
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {listing.status === "ACTIVE" ? (
          <DropdownMenuItem onClick={() => handleStatusChange("BLOCKED")}>
            <Shield className='mr-2 h-4 w-4' />
            Block Listing
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")}>
            <Shield className='mr-2 h-4 w-4' />
            Activate Listing
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete Listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
