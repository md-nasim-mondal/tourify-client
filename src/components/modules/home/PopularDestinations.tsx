"use client";

import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import Link from "next/link";
import Image from "next/image";

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  tourCount: number;
  rating: number;
}

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      // API call
      const response = await serverFetch.get("/destinations/popular");
      
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.data || generateMockDestinations());
      } else {
        // Fallback to mock data
        setDestinations(generateMockDestinations());
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setDestinations(generateMockDestinations());
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  const generateMockDestinations = (): Destination[] => [
    {
      id: "1",
      name: "Santorini",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop",
      description: "Beautiful island with stunning sunsets",
      tourCount: 42,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w-800&auto=format&fit=crop",
      description: "Ancient temples and traditional culture",
      tourCount: 38,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&auto=format&fit=crop",
      description: "Tropical paradise with rich culture",
      tourCount: 56,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
      description: "The city of love and lights",
      tourCount: 67,
      rating: 4.6,
    },
    {
      id: "5",
      name: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
      description: "The city that never sleeps",
      tourCount: 45,
      rating: 4.5,
    },
    {
      id: "6",
      name: "Sydney",
      country: "Australia",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop",
      description: "Harbor city with iconic opera house",
      tourCount: 32,
      rating: 4.8,
    },
  ];

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Popular Destinations
            </h2>
            <p className="text-gray-600">
              Discover the most sought-after travel spots
            </p>
          </div>
          <Link href="/destinations">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.id}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{destination.rating}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{destination.country}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {destination.tourCount} tours available
                    </span>
                    <Button size="sm" variant="ghost" className="text-blue-600">
                      Explore →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;