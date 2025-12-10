import Image from "next/image";
import { MapPin, Star, Users, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TourDetailsProps {
  listing: {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    duration: string;
    maxGroupSize: number;
    category: string;
    languages: string[];
    meetingPoint: string;
    averageRating: number;
    totalReviews: number;
    guide: {
      id: string;
      name: string;
      photo?: string;
      bio: string;
      languagesSpoken: string[];
      expertise: string[];
      _count: {
        listings: number;
        reviews: number;
      };
    };
  };
}

export default function TourDetails({ listing }: TourDetailsProps) {
  return (
    <div className='space-y-6'>
      {/* Image Gallery */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='relative col-span-2 h-96 overflow-hidden rounded-xl'>
          <Image
            src={listing.images[0] || "/placeholder-tour.jpg"}
            alt={listing.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 66vw'
            priority
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {listing.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className='relative h-44 overflow-hidden rounded-xl'>
              <Image
                src={image}
                alt={`${listing.title} - ${index + 1}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 50vw, 33vw'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tour Info */}
      <Card>
        <CardContent className='p-6'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              {listing.title}
            </h1>
            <div className='mt-4 flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <Star className='h-5 w-5 fill-amber-400 text-amber-400' />
                  <span className='font-bold'>
                    {listing.averageRating.toFixed(1)}
                  </span>
                  <span className='text-gray-500'>
                    ({listing.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-gray-400' />
                <span>{listing.location}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-gray-400' />
                <span>{listing.duration}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-gray-400' />
                <span>Max {listing.maxGroupSize} people</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className='mb-6 rounded-lg bg-primary/5 p-4'>
            <div className='text-3xl font-bold text-primary'>
              ${listing.price}
            </div>
            <p className='text-gray-600'>per person</p>
          </div>

          {/* Description */}
          <div className='mb-6'>
            <h2 className='mb-3 text-xl font-bold text-gray-900'>
              About this tour
            </h2>
            <div className='prose max-w-none text-gray-600'>
              {listing.description.split("\n").map((para, idx) => (
                <p key={idx} className='mb-3'>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className='mb-6'>
            <h3 className='mb-2 text-lg font-bold text-gray-900'>Languages</h3>
            <div className='flex flex-wrap gap-2'>
              {listing.languages.map((lang) => (
                <span
                  key={lang}
                  className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'>
                  <Globe className='h-3 w-3' />
                  {lang}
                </span>
              ))}
            </div>
          </div>

      {/* Meeting Point */}
      <div className='mb-6'>
        <h3 className='mb-2 text-lg font-bold text-gray-900'>
          Meeting Point
        </h3>
        <p className='text-gray-600'>{listing.meetingPoint}</p>
      </div>
    </CardContent>
  </Card>

  {/* Map View */}
  <Card>
    <CardContent className='p-0'>
      <div className='h-96 w-full overflow-hidden rounded-xl'>
        <iframe
          title='Tour Map'
          src={`https://www.google.com/maps?q=${encodeURIComponent(listing.meetingPoint || listing.location)}&output=embed`}
          className='h-full w-full border-0'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>
    </CardContent>
  </Card>

      {/* Guide Info */}
      <Card>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-900'>
            About your guide
          </h2>
          <div className='flex items-start gap-4'>
            <div className='relative h-20 w-20 overflow-hidden rounded-full'>
              <Image
                src={listing.guide.photo || "/placeholder-avatar.jpg"}
                alt={listing.guide.name}
                fill
                className='object-cover'
                sizes='80px'
              />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-bold text-gray-900'>
                {listing.guide.name}
              </h3>
              {/* Guide Badges */}
              <div className='mt-2 flex flex-wrap gap-2'>
                {listing.averageRating >= 4.5 && listing.totalReviews >= 10 && (
                  <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>
                    Super Guide
                  </span>
                )}
                {listing.totalReviews < 3 && (
                  <span className='rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700'>
                    Newcomer
                  </span>
                )}
                {listing.category?.toLowerCase().includes("food") && (
                  <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'>
                    Foodie Expert
                  </span>
                )}
              </div>
              <p className='mt-1 text-gray-600'>{listing.guide.bio}</p>

              <div className='mt-4'>
                <h4 className='font-semibold text-gray-900'>Expertise</h4>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {listing.guide.expertise.map((exp) => (
                    <span
                      key={exp}
                      className='rounded-full bg-primary/10 px-3 py-1 text-xs text-primary'>
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <div className='text-lg font-bold'>
                    {listing.guide._count.listings}
                  </div>
                  <div className='text-sm text-gray-600'>Tours hosted</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <div className='text-lg font-bold'>
                    {listing.guide._count.reviews}
                  </div>
                  <div className='text-sm text-gray-600'>Total reviews</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Reviews rendered in parent page */}
    </div>
  );
}
