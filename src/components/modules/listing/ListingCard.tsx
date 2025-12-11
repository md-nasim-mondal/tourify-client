import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ListingCardProps = {
  listing: {
    id: string;
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    images?: string[];
    duration?: string | number;
    maxGroupSize?: number;
    category?: string;
    languages?: string[];
    meetingPoint?: string;
    averageRating?: number;
    totalReviews?: number;
    guideId?: string;
    latitude?: number | null;
    longitude?: number | null;
    guide?: {
      id?: string;
      name?: string;
      email?: string;
      photo?: string | null;
      bio?: string | null;
      contactNo?: string | null;
      languagesSpoken?: string[];
      expertise?: string[];
      _count?: {
        listings?: number;
        reviews?: number;
      };
    };
    _count?: {
      reviews?: number;
      bookings?: number;
    };
  };
};

export default function ListingCard({ listing }: ListingCardProps) {
  const img =
    listing?.images && listing?.images?.length > 0
      ? listing?.images?.[0]
      : "/placeholder-tour.jpg";
  const title = listing?.title || "Untitled Tour";
  const location = listing?.location || "Unknown";
  const price = listing?.price ? `$${listing?.price}` : "—";
  const rating = listing?.averageRating
    ? listing?.averageRating?.toFixed(1)
    : "0.0";
  const reviews = listing?.totalReviews ?? 0;
  const duration = listing?.duration ? String(listing?.duration) : "—";
  const maxGroupSize = listing?.maxGroupSize ?? undefined;

  return (
    <Link href={`/tours/${listing.id}`}>
      <Card className='group overflow-hidden transition-all hover:shadow-lg'>
        <div className='relative h-44 overflow-hidden'>
          <Image
            src={img}
            alt={title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <div className='absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold'>
            {price}
          </div>
        </div>
        <CardContent className='p-5'>
          <div className='mb-3 flex items-center justify-between'>
            <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
              {listing?.category || "General"}
            </span>
            <div className='flex items-center gap-1'>
              <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
              <span className='font-bold'>{rating}</span>
              <span className='text-gray-500'>({reviews})</span>
            </div>
          </div>
          <h3 className='mb-2 line-clamp-1 text-lg font-bold text-gray-900'>
            {title}
          </h3>
          <div className='mt-3 flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              <span>{location}</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>{duration}</span>
              </div>
              {typeof maxGroupSize === "number" && (
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  <span>Max {maxGroupSize}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
