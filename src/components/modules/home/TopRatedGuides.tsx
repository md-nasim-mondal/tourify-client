"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import Link from "next/link";
import Image from "next/image";

interface Guide {
  id: string;
  name: string;
  avatar: string;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  yearsExperience: number;
}

const TopRatedGuides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await serverFetch.get("/guides/top-rated");
      
      if (response.ok) {
        const data = await response.json();
        setGuides(data.data || generateMockGuides());
      } else {
        setGuides(generateMockGuides());
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      setGuides(generateMockGuides());
    } finally {
      setLoading(false);
    }
  };

  const generateMockGuides = (): Guide[] => [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
      location: "Paris, France",
      languages: ["English", "French", "Spanish"],
      rating: 4.9,
      reviewCount: 128,
      specialties: ["History", "Food", "Architecture"],
      yearsExperience: 8,
    },
    {
      id: "2",
      name: "Kenji Tanaka",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      location: "Kyoto, Japan",
      languages: ["Japanese", "English"],
      rating: 4.8,
      reviewCount: 95,
      specialties: ["Culture", "Temples", "Gardens"],
      yearsExperience: 6,
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
      location: "Barcelona, Spain",
      languages: ["Spanish", "English", "Catalan"],
      rating: 4.7,
      reviewCount: 156,
      specialties: ["Art", "Architecture", "Food"],
      yearsExperience: 10,
    },
    {
      id: "4",
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
      location: "New York, USA",
      languages: ["English", "Mandarin"],
      rating: 4.9,
      reviewCount: 203,
      specialties: ["Street Food", "History", "Photography"],
      yearsExperience: 7,
    },
  ];

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Top Rated Guides
            </h2>
            <p className="text-gray-600">
              Connect with our verified local experts
            </p>
          </div>
          <Link href="/guides">
            <Button variant="outline">View All Guides</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={guide.avatar}
                        alt={guide.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" />
                      {guide.rating}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {guide.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{guide.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {guide.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{guide.reviewCount} reviews</span>
                      </div>
                      <div>
                        <span>{guide.yearsExperience} years exp</span>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      {guide.specialties.slice(0, 2).join(" • ")}
                    </div>
                  </div>

                  <Link href={`/guides/${guide.id}`} className="w-full">
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedGuides;