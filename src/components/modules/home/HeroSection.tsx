"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HeroSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className='relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 text-white'>
      <div className='absolute inset-0 bg-black/20'></div>

      <div className='relative container mx-auto px-4 py-24 md:py-32'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Discover Amazing Tours with Local Guides
          </h1>

          <p className='text-xl md:text-2xl mb-10 text-white/90'>
            Experience destinations like a local. Book authentic tours with
            verified guides.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className='max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-2xl flex'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search for tours, destinations, or guides...'
              className='flex-1 px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none rounded-l-lg'
            />
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-r-lg flex items-center gap-2'>
              <Search size={20} />
              Search
            </Button>
          </form>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-16'>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold'>500+</div>
              <div className='text-white/80'>Verified Guides</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold'>1000+</div>
              <div className='text-white/80'>Tours Available</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold'>50+</div>
              <div className='text-white/80'>Countries</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold'>95%</div>
              <div className='text-white/80'>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
