import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "London, UK",
    text: "My food tour in Tokyo with Kenji was incredible! He showed us hidden gems we would never find on our own.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop",
  },
  {
    name: "Michael Chen",
    location: "San Francisco, USA",
    text: "The historical tour in Rome was absolutely fascinating. Our guide's knowledge was impressive!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
  },
  {
    name: "Emma Wilson",
    location: "Sydney, Australia",
    text: "Bali temple tour was a spiritual experience. Our guide made us feel like family. Highly recommend!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Traveler <span className="text-primary">Testimonials</span>
          </h2>
          <p className="mt-4 text-gray-600">
            See what our travelers say about their experiences
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="relative">
              <Quote className="absolute -top-4 left-6 h-8 w-8 text-primary/20" />
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-6 text-gray-600 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 rounded-2xl bg-linear-to-r from-gray-900 to-gray-800 p-8 text-white">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="mt-2 text-gray-300">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="mt-2 text-gray-300">Local Guides</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">4.8</div>
              <div className="mt-2 text-gray-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">150+</div>
              <div className="mt-2 text-gray-300">Cities Worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}