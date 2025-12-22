"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/modules/listing/ListingCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/explore?${params.toString()}`;
  };

  if (!tours || tours.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500'>
        <div className="relative h-40 w-40 mb-6 opacity-80 hover:opacity-100 transition-opacity">
            <Image 
               src="/placeholder-empty.png" 
               alt="No tours found" 
               fill 
               className="object-contain"
               onError={(e) => {
                  // Fallback if image missing
                  e.currentTarget.style.display = 'none';
               }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-6xl">🔍</span>
            </div>
        </div>
        <h3 className='text-2xl font-bold text-foreground'>No tours found</h3>
        <p className='mt-2 text-muted-foreground max-w-md'>
          We couldn't find any tours matching your criteria. Try adjusting your filters or search term.
        </p>
        <Button 
          variant="outline" 
          className="mt-6" 
          onClick={() => window.location.href = '/explore'}
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <p className='text-muted-foreground font-medium'>
          Showing <span className="text-foreground font-bold">{tours.length}</span> of <span className="text-foreground font-bold">{meta.total}</span> tours
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
        {tours.map((tour) => (
          <div key={tour.id} className="h-full">
             <ListingCard listing={tour} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-12 flex justify-center'>
          <div className='flex items-center gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-lg shadow-sm border border-border/50'>
             <Button
               variant="ghost"
               size="icon"
               disabled={meta.page <= 1}
               asChild={meta.page > 1}
             >
               {meta.page > 1 ? (
                  <Link href={createPageUrl(meta.page - 1)} aria-label="Previous Page">
                     <ChevronLeft className="h-4 w-4" />
                  </Link>
               ) : (
                  <span className="opacity-50"><ChevronLeft className="h-4 w-4" /></span>
               )}
             </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
               // Show ellipsis logic could be added here for many pages
               if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= meta.page - 1 && page <= meta.page + 1)
               ) {
                  return (
                     <Link
                        key={page}
                        href={createPageUrl(page)}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        meta.page === page
                           ? "bg-primary text-primary-foreground shadow-sm"
                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}>
                        {page}
                     </Link>
                  );
               } else if (
                  (page === meta.page - 2 && page > 1) || 
                  (page === meta.page + 2 && page < totalPages)
               ) {
                  return <span key={page} className="px-1 text-muted-foreground">...</span>;
               }
               return null;
            })}

            <Button
               variant="ghost"
               size="icon"
               disabled={meta.page >= totalPages}
               asChild={meta.page < totalPages}
            >
               {meta.page < totalPages ? (
                  <Link href={createPageUrl(meta.page + 1)} aria-label="Next Page">
                     <ChevronRight className="h-4 w-4" />
                  </Link>
               ) : (
                  <span className="opacity-50"><ChevronRight className="h-4 w-4" /></span>
               )}
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
