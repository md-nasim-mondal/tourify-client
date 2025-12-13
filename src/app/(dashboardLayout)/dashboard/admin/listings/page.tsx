
export const dynamic = "force-dynamic";

import { getListings } from "@/services/listing/listing.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ListingManagementActions from "@/components/modules/admin/ListingManagementActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminListingsPage() {
  const { data: listings } = await getListings();

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Manage Listings</h1>
        <p className='text-muted-foreground'>
          Review and manage all tour listings.
        </p>
      </div>

      <div className='border rounded-lg bg-white overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Listing Details</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings?.length > 0 ? (
              listings.map((listing: any) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className='font-medium'>{listing.title}</div>
                    <div className='text-sm text-muted-foreground'>
                      {listing.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={listing.guide?.photo} />
                            <AvatarFallback>{listing.guide?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{listing.guide?.name || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${listing.price}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === "ACTIVE" ? "default" : "destructive"
                      }>
                      {listing.status || "ACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <ListingManagementActions listing={listing} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No listings found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
