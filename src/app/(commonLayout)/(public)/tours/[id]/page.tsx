import { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetails from "@/components/modules/tours/TourDetails";
import BookingWidget from "@/components/modules/tours/BookingWidget";
import { getSingleListing } from "@/services/listing/listing.service";
import { serverFetch } from "@/lib/server-fetch";
import ReviewList from "@/components/modules/reviews/ReviewList";

interface TourPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getReviews(listingId: string) {
  const res = await serverFetch.get(`/reviews/${listingId}`);
  const result = await res.json();
  if (result.success) {
    return result.data;
  }
  return [];
}

export async function generateMetadata({
  params,
}: TourPageProps): Promise<Metadata> {
  const { id } = await params;
  const {data: listing} = await getSingleListing(id);

  if (!listing) {
    return {
      title: "Tour Not Found - Tourify",
    };
  }

  return {
    title: `${listing?.title} - Tourify`,
    description: listing?.description?.substring(0, 160),
    openGraph: {
      title: listing?.title,
      description: listing?.description?.substring(0, 160),
      images: listing?.images,
    },
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { id } = await params;
  const {data: listing} = await getSingleListing(id);
  const reviews = await getReviews(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            <TourDetails listing={listing} />
            <ReviewList reviews={reviews} />
          </div>

          {/* Booking Sidebar */}
          <div className='lg:col-span-1'>
            <BookingWidget listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
