"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { serverFetch } from "@/lib/server-fetch";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  tour: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await serverFetch.get("/testimonials");
      
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.data || generateMockTestimonials());
      } else {
        setTestimonials(generateMockTestimonials());
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials(generateMockTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTestimonials = (): Testimonial[] => [
    {
      id: "1",
      name: "Jennifer Lee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
      location: "San Francisco, USA",
      rating: 5,
      comment: "The food tour in Tokyo was incredible! Our guide Kenji showed us hidden gems we would never have found on our own. The sushi making class was a highlight!",
      date: "2024-01-15",
      tour: "Tokyo Food Adventure",
    },
    {
      id: "2",
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      location: "London, UK",
      rating: 5,
      comment: "Sarah's historical tour of Paris was absolutely fascinating. Her knowledge of French history brought every location to life. Highly recommend!",
      date: "2024-01-10",
      tour: "Paris History Walk",
    },
    {
      id: "3",
      name: "Sophia Garcia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
      location: "Madrid, Spain",
      rating: 4,
      comment: "Beautiful hike in the Swiss Alps with breathtaking views. Our guide was very professional and ensured our safety throughout. Amazing experience!",
      date: "2024-01-05",
      tour: "Swiss Alpine Trek",
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Traveler Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our travelers are saying about their experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden">
              <div className="absolute top-6 right-6 text-gray-200">
                <Quote className="h-12 w-12" />
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.comment}&quot;</p>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-sm text-gray-500">{testimonial.tour}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;