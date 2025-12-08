import ToursListing from "@/components/modules/tours/ToursListing";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tours - Tourify",
  description: "Browse and book amazing tours with local guides",
};

interface ToursPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Tours
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Book authentic experiences with local guides around the world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ToursLoading />}>
          <ToursListing searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

function ToursLoading() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}