"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Star, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-fetch";
import Link from "next/link";
import Image from "next/image";
import ToursFilters from "./ToursFilters";
import Pagination from "@/components/shared/Pagination";

interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  guide: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface ToursListingProps {
  searchParams: {
    search?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    sort?: string;
    page?: string;
  };
}

const ToursListing = ({ searchParams }: ToursListingProps) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const page = parseInt(searchParams.page || "1");
      setCurrentPage(page);

      const queryParams = new URLSearchParams();
      if (searchParams.search)
        queryParams.append("search", searchParams.search);
      if (searchParams.category)
        queryParams.append("category", searchParams.category);
      if (searchParams.location)
        queryParams.append("location", searchParams.location);
      if (searchParams.minPrice)
        queryParams.append("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice)
        queryParams.append("maxPrice", searchParams.maxPrice);
      if (searchParams.duration)
        queryParams.append("duration", searchParams.duration);
      if (searchParams.sort) queryParams.append("sort", searchParams.sort);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "12");

      const response = await serverFetch.get(`/tours?${queryParams}`);

      if (response.ok) {
        const data = await response.json();
        setTours(data.data?.tours || generateMockTours());
        setTotalPages(data.data?.totalPages || 1);
      } else {
        setTours(generateMockTours());
        setTotalPages(2);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      setTours(generateMockTours());
      setError("Failed to load tours. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery);
      window.location.href = `/tours?${params.toString()}`;
    }
  };

  const generateMockTours = (): Tour[] => [
    {
      id: "1",
      title: "Tokyo Street Food Tour",
      description:
        "Explore hidden food stalls and taste authentic Japanese street food.",
      location: "Tokyo, Japan",
      price: 75,
      duration: 3,
      maxGroupSize: 8,
      category: "Food & Dining",
      rating: 4.9,
      reviewCount: 128,
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
      guide: {
        id: "g1",
        name: "Kenji Tanaka",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      },
    },
    // Add more mock tours...
  ];

  if (loading) {
    return (
      <div className='py-12'>
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Search Bar */}
      <div className='mb-8'>
        <form onSubmit={handleSearch} className='relative'>
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search for tours, destinations, or activities...'
            className='pl-12 pr-4 py-6 text-lg rounded-full shadow-lg'
          />
          <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6' />
          <Button
            type='submit'
            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-8'>
            Search
          </Button>
        </form>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Filters Sidebar */}
        <div className='lg:w-1/4'>
          <div className='lg:sticky lg:top-24'>
            <div className='flex items-center justify-between mb-4 lg:hidden'>
              <h2 className='text-lg font-bold'>Filters</h2>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden'>
                <Filter className='h-4 w-4 mr-2' />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {(showFilters || window.innerWidth >= 1024) && (
              <ToursFilters searchParams={searchParams} />
            )}
          </div>
        </div>

        {/* Tours Grid */}
        <div className='lg:w-3/4'>
          {/* Results Header */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                {tours.length} Tours Found
              </h2>
              {searchParams.search && (
                <p className='text-gray-600'>
                  Results for &quot;{searchParams.search}&quot;
                </p>
              )}
            </div>

            <div className='flex items-center space-x-4'>
              <select
                value={searchParams.sort || "rating"}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("sort", e.target.value);
                  window.location.href = `/tours?${params.toString()}`;
                }}
                className='border rounded-lg px-4 py-2'>
                <option value='rating'>Highest Rated</option>
                <option value='price_low'>Price: Low to High</option>
                <option value='price_high'>Price: High to Low</option>
                <option value='duration'>Shortest Duration</option>
                <option value='newest'>Newest First</option>
              </select>
            </div>
          </div>

          {error && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
              <p className='text-yellow-800'>{error}</p>
            </div>
          )}

          {/* Tours Grid */}
          {tours.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-gray-400 mb-4'>
                No tours found matching your criteria.
              </div>
              <Button onClick={() => (window.location.href = "/tours")}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {tours.map((tour) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`}>
                    <Card className='group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full'>
                      <div className='relative h-48 overflow-hidden'>
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1'>
                          <Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
                          <span className='font-bold'>{tour.rating}</span>
                          <span className='text-gray-600 text-sm'>
                            ({tour.reviewCount})
                          </span>
                        </div>
                      </div>

                      <CardContent className='p-6'>
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <h3 className='text-xl font-bold text-gray-900 mb-1 line-clamp-1'>
                              {tour.title}
                            </h3>
                            <div className='flex items-center text-gray-600'>
                              <MapPin className='h-4 w-4 mr-1' />
                              <span className='text-sm'>{tour.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className='text-gray-600 mb-4 line-clamp-2 text-sm'>
                          {tour.description}
                        </p>

                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center space-x-4 text-sm text-gray-600'>
                            <div className='flex items-center'>
                              <Clock className='h-4 w-4 mr-1' />
                              <span>{tour.duration} hours</span>
                            </div>
                            <div className='flex items-center'>
                              <Users className='h-4 w-4 mr-1' />
                              <span>Max {tour.maxGroupSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center justify-between pt-4 border-t'>
                          <div className='flex items-center'>
                            <div className='w-8 h-8 rounded-full overflow-hidden mr-2'>
                              <Image
                                src={tour.guide.avatar}
                                alt={tour.guide.name}
                                width={32}
                                height={32}
                                className='object-cover'
                              />
                            </div>
                            <span className='text-sm font-medium'>
                              {tour.guide.name}
                            </span>
                          </div>
                          <div className='text-right'>
                            <div className='text-2xl font-bold text-gray-900'>
                              ${tour.price}
                            </div>
                            <div className='text-sm text-gray-600'>
                              per person
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl='/tours'
                  searchParams={searchParams}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToursListing;
