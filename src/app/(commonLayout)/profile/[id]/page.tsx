import { getSingleUser } from "@/services/user/getSingleUser";
import { getReviewsByListingId } from "@/services/review/getReviewsByListingId";
import { getListingsByGuideId } from "@/services/listing/getListingsByGuideId";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone, BookOpen, Star } from "lucide-react";
import ListingCard from "@/components/modules/listing/ListingCard";
import ReviewCard from "@/components/modules/reviews/ReviewCard";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = params;

  let user;
  try {
    const userResponse = await getSingleUser(id);
    user = userResponse.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    notFound();
  }

  if (!user) {
    notFound();
  }

  const isGuide = user.role === "GUIDE";

  // Fetch data specific to guides
  let listings: { id: string }[] = [];
  const guideReviews: { id: string }[] = [];
  let averageRating = "0.0";
  let totalReviews = 0;
  let toursGiven = 0;

  if (isGuide) {
    try {
      const listingsResponse = await getListingsByGuideId(user.id);
      listings = listingsResponse.data;

      // Calculate overall guide rating and total reviews from their listings
      if (listings.length > 0) {
        const allReviews = await Promise.all(
          listings.map(async (listing: { id: string }) => {
            const res = await getReviewsByListingId(listing.id);
            return res.data as { id: string; rating: number }[];
          })
        );

        const flatReviews: { id: string; rating: number }[] = allReviews.flat();
        totalReviews = flatReviews.length;
        const totalRatingSum = flatReviews.reduce(
          (sum: number, review: { rating: number }) => sum + review.rating,
          0
        );
        averageRating =
          totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";
        toursGiven = listings.length;
      }
    } catch (error) {
      console.error("Failed to fetch guide listings or reviews:", error);
      // Continue without this data if fetching fails
    }
  } else {
    // If it's a tourist, fetch reviews written by them
    try {
      // Need a service to get reviews by touristId or modify existing getAllReviews
      // For now, let's assume getReviewsByListingId can be adapted or a new service created.
      // This part might need further implementation on the server if not already present.
      // Example: const touristReviewsResponse = await getReviewsByTouristId(user.id);
      // guideReviews = touristReviewsResponse.data;
    } catch (error) {
      console.error("Failed to fetch tourist reviews:", error);
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mb-8'>
        <CardHeader className='flex flex-col md:flex-row items-center gap-6'>
          <Avatar className='h-24 w-24 border-4 border-primary'>
            <AvatarImage
              src={user.photo || "/placeholder-avatar.png"}
              alt={user.name}
            />
            <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
          <div className='text-center md:text-left'>
            <CardTitle className='text-3xl font-bold'>{user.name}</CardTitle>
            <CardDescription className='text-lg text-muted-foreground'>
              {isGuide ? "Local Guide" : "Traveler"}
            </CardDescription>
            <div className='flex items-center justify-center md:justify-start gap-2 mt-2'>
              <Badge variant='secondary'>{user.role}</Badge>
              {user.isVerified && <Badge variant='default'>Verified</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            {user.bio || "No biography provided."}
          </p>
          <Separator />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {user.email && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Mail className='h-5 w-5' />
                <span>{user.email}</span>
              </div>
            )}
            {user.contactNo && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Phone className='h-5 w-5' />
                <span>{user.contactNo}</span>
              </div>
            )}
            {user.address && (
              <div className='flex items-center gap-2 text-gray-600'>
                <MapPin className='h-5 w-5' />
                <span>{user.address}</span>
              </div>
            )}
            {user.languagesSpoken &&
              user.languagesSpoken.length > 0 &&
              isGuide && (
                <div className='flex items-center gap-2 text-gray-600'>
                  <BookOpen className='h-5 w-5' />
                  <span>Languages: {user.languagesSpoken.join(", ")}</span>
                </div>
              )}
            {user.expertise && user.expertise.length > 0 && isGuide && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Star className='h-5 w-5' />
                <span>Expertise: {user.expertise.join(", ")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isGuide && (
        <>
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Guide Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
                <div className='p-4 border rounded-lg'>
                  <h3 className='text-2xl font-bold'>{toursGiven}</h3>
                  <p className='text-gray-600'>Tours Hosted</p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='text-2xl font-bold'>{averageRating} / 5.0</h3>
                  <p className='text-gray-600'>Average Rating</p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='text-2xl font-bold'>{totalReviews}</h3>
                  <p className='text-gray-600'>Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>
              Active Listings by {user.name}
            </h2>
            {listings.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {listings.map((listing: { id: string }) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <p className='text-gray-600'>
                This guide has no active listings yet.
              </p>
            )}
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4'>Reviews for {user.name}</h2>
            {guideReviews.length > 0 ? (
              <div className='space-y-4'>
                {guideReviews.map((review: { id: string }) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className='text-gray-600'>No reviews yet for this guide.</p>
            )}
          </section>
        </>
      )}

      {!isGuide && (
        <section>
          <h2 className='text-2xl font-bold mb-4'>Reviews by {user.name}</h2>
          {guideReviews.length > 0 ? (
            <div className='space-y-4'>
              {guideReviews.map((review: { id: string }) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className='text-gray-600'>
              This traveler has not written any reviews yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default ProfilePage;
