import { Metadata } from "next";
import { Suspense } from "react";
import ExploreFilters from "@/components/modules/explore/ExploreFilters";
import { getListings, getCategories, getLanguages } from "@/services/listing/listing.service";
import ExploreContent from "@/components/modules/explore/ExploreContent";

export const dynamic = "force-dynamic";

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

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  
  let listingsData: any = { data: [], meta: { total: 0, page: 1, limit: 12 } };
  let categories: string[] = [];
  let languages: string[] = [];

  try {
    const [listingsRes, categoriesRes, languagesRes] = await Promise.all([
        getListings({
            searchTerm: params.searchTerm,
            location: params.city,
            category: params.category,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            language: params.language,
            page: params.page || "1",
            limit: "12",
        }).catch(err => {
             console.error("Listings fetch failed", err);
             return null;
        }),
        getCategories().catch(err => {
             console.error("Categories fetch failed", err);
             return null;
        }),
        getLanguages().catch(err => {
             console.error("Languages fetch failed", err);
             return null;
        })
    ]);

    if (listingsRes) {
        listingsData = listingsRes;
    }
    
    // Service returns { success: true, data: [...] }
    if (categoriesRes && categoriesRes.data) {
        categories = categoriesRes.data;
    }

    if (languagesRes && languagesRes.data) {
        languages = languagesRes.data;
    }

  } catch (error) {
    console.error("Error in ExplorePage data fetching:", error);
  }

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
             <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                <ExploreFilters categories={categories} languages={languages} />
             </Suspense>
          </div>

          {/* Tour List & Map */}
          <div className="lg:col-span-3">
             <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                <ExploreContent listingsData={listingsData} />
             </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}