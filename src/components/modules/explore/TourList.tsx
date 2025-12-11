import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  duration: string;
  maxGroupSize: number;
  category: string;
  averageRating: number;
  totalReviews: number;
  guide: {
    name: string;
    photo?: string;
  };
}

interface TourListProps {
  listingsData: {
    data: Tour[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export default function TourList({ listingsData }: TourListProps) {
  const { data: tours, meta } = listingsData;

  if (!tours || tours.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-semibold text-gray-900'>No tours found</h3>
        <p className='mt-2 text-gray-600'>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <p className='text-gray-600'>
          Showing {tours.length} of {meta.total} tours
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {tours.map((tour) => (
          <Link key={tour.id} href={`/tours/${tour.id}`}>
            <Card className='group overflow-hidden transition-all hover:shadow-lg'>
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={tour.images[0] || "/placeholder-tour.jpg"}
                  alt={tour.title}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                <div className='absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold'>
                  ${tour.price}
                </div>
              </div>

              <CardContent className='p-6'>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                    {tour.category}
                  </span>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                    <span className='font-bold'>
                      {tour.averageRating.toFixed(1)}
                    </span>
                    <span className='text-gray-500'>({tour.totalReviews})</span>
                  </div>
                </div>

                <h3 className='mb-2 line-clamp-1 text-lg font-bold text-gray-900'>
                  {tour.title}
                </h3>

                <p className='mb-4 line-clamp-2 text-gray-600'>
                  {tour.description}
                </p>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <MapPin className='h-4 w-4' />
                  <span>{tour.location}</span>
                </div>

                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      {tour.duration}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4' />
                      Max {tour.maxGroupSize}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {tour.guide.photo && (
                      <div className='relative h-8 w-8 overflow-hidden rounded-full'>
                        <Image
                          src={tour.guide.photo}
                          alt={tour.guide.name}
                          fill
                          className='object-cover'
                          sizes='32px'
                        />
                      </div>
                    )}
                    <span className='text-sm font-medium'>
                      {tour.guide.name}
                    </span>
                    {/* Guide Badges */}
                    <div className='flex items-center gap-1'>
                      {tour.averageRating >= 4.5 && tour.totalReviews >= 10 && (
                        <span className='rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700'>
                          Super Guide
                        </span>
                      )}
                      {tour.totalReviews < 3 && (
                        <span className='rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700'>
                          Newcomer
                        </span>
                      )}
                      {tour.category?.toLowerCase().includes("food") && (
                        <span className='rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700'>
                          Foodie Expert
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {meta.total > meta.limit && (
        <div className='mt-8 flex justify-center'>
          <div className='flex gap-2'>
            {Array.from(
              { length: Math.ceil(meta.total / meta.limit) },
              (_, i) => i + 1
            ).map((page) => (
              <Link
                key={page}
                href={`/explore?page=${page}`}
                className={`rounded-md px-4 py-2 ${
                  meta.page === page
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {page}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
