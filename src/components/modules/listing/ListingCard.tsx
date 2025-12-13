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
      <Card className='group h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-border/50'>
        {/* Image Container */}
        <div className='relative aspect-[4/3] overflow-hidden'>
          <Image
            src={img}
            alt={title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60' />
          
          {/* Price Badge */}
          <div className='absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur-sm dark:bg-black/80'>
            {price}
          </div>

          {/* Category Badge */}
          <div className='absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md'>
            {listing?.category || "Experience"}
          </div>
        </div>

        <CardContent className='p-5'>
          {/* Header */}
          <div className='mb-3 flex items-start justify-between gap-2'>
            <h3 className='line-clamp-1 text-lg font-bold text-foreground group-hover:text-primary transition-colors'>
              {title}
            </h3>
            <div className='flex items-center gap-1 shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 dark:bg-amber-900/30'>
              <Star className='h-3.5 w-3.5 fill-amber-500 text-amber-500' />
              <span className='text-xs font-bold text-amber-700 dark:text-amber-400'>{rating}</span>
            </div>
          </div>

          {/* Location */}
          <div className='mb-4 flex items-center gap-1.5 text-sm text-muted-foreground'>
            <MapPin className='h-4 w-4 text-primary' />
            <span className='line-clamp-1'>{location}</span>
          </div>

          {/* Footer Info */}
          <div className='flex items-center justify-between border-t border-border pt-4 text-xs font-medium text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <Clock className='h-4 w-4' />
              <span>{duration}</span>
            </div>
            
            {typeof maxGroupSize === "number" && (
              <div className='flex items-center gap-1.5'>
                <Users className='h-4 w-4' />
                <span>Max {maxGroupSize}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
