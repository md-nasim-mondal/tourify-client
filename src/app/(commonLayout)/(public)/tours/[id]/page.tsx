import { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetails from "@/components/modules/tours/TourDetails";
import BookingWidget from "@/components/modules/tours/BookingWidget";
import { getSingleListing, getListings } from "@/services/listing/listing.service";
import { serverFetch } from "@/lib/server-fetch";
import ReviewList from "@/components/modules/reviews/ReviewList";
import { getCookie } from "@/services/auth/tokenHandlers";
import ListingCard from "@/components/modules/listing/ListingCard";
import { Button } from "@/components/ui/button";

interface TourPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getReviews(listingId: string) {
  const res = await serverFetch.get(`/reviews/listing/${listingId}`);
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
  const { data: listing } = await getSingleListing(id);

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
  const { data: listing } = await getSingleListing(id);
  const reviews = await getReviews(id);
  const accessToken = await getCookie("accessToken");

  // Fetch suggested listings (same category)
  const { data: suggestedListingsData } = await getListings({
    category: listing?.category,
    limit: "4",
  });

  const suggestedTours =
    suggestedListingsData?.filter((item: any) => item.id !== id).slice(0, 3) || [];

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TourDetails listing={listing} />

            {/* Reviews */}
            <div id="reviews">
              <ReviewList reviews={reviews} />
            </div>

            {/* Q&A Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Questions & Answers</h2>
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <p className="font-semibold mb-1">Q: Is hotel pickup included?</p>
                  <p className="text-muted-foreground">
                    A: Yes, we provide pickup from most central hotels. Please check
                    the meeting point details.
                  </p>
                </div>
                <div className="border-b border-border/50 pb-4">
                  <p className="font-semibold mb-1">Q: Is this suitable for children?</p>
                  <p className="text-muted-foreground">
                    A: Absolutely! This tour is family-friendly and suitable for all
                    ages.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="outline">Ask a Question</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget accessToken={accessToken as string} listing={listing} />
          </div>
        </div>

        {/* Suggested Tours */}
        {suggestedTours.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedTours.map((tour: any) => (
                <div key={tour.id} className="h-full">
                  <ListingCard listing={tour} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
