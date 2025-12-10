import { Metadata } from "next";
import ExploreFilters from "@/components/modules/explore/ExploreFilters";
import TourList from "@/components/modules/explore/TourList";
import { getListings } from "@/services/listing/listing.service";
import { serverFetch } from "@/lib/server-fetch";

export const metadata: Metadata = {
  title: "Explore Tours - Tourify",
  description: "Discover amazing tours and local experiences worldwide.",
};

interface ExplorePageProps {
  searchParams: Promise<{
    searchTerm?: string;
    city?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    language?: string;
    page?: string;
  }>;
}

async function getCategories() {
    const res = await serverFetch.get('/listings/categories/list');
    const result = await res.json();
    if (result.success) {
        return result.data;
    }
    return [];
}

async function getLanguages() {
    const res = await serverFetch.get('/listings/languages/list');
    const result = await res.json();
    if (result.success) {
        return result.data;
    }
    return [];
}


export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  
  // Fetch listings with filters
  const listingsData = await getListings({
    searchTerm: params.searchTerm,
    location: params.city,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    language: params.language,
    page: params.page || "1",
    limit: "12",
  });

  const categories = await getCategories();
  const languages = await getLanguages();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Tours</h1>
          <p className="mt-2 text-gray-600">
            Discover unique experiences led by passionate local guides
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ExploreFilters categories={categories} languages={languages} />
          </div>

          {/* Tour List */}
          <div className="lg:col-span-3">
            <TourList listingsData={listingsData} />
          </div>
        </div>
      </div>
    </div>
  );
}