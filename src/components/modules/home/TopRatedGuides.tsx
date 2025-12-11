import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle } from "lucide-react";

const guides = [
  {
    id: 1,
    name: "Maria Rodriguez",
    location: "Barcelona, Spain",
    rating: 4.9,
    reviews: 127,
    expertise: ["Food Tours", "Architecture"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    location: "Kyoto, Japan",
    rating: 4.8,
    reviews: 89,
    expertise: ["History", "Tea Ceremony"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Sophie Martin",
    location: "Paris, France",
    rating: 4.7,
    reviews: 156,
    expertise: ["Art", "Photography"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    location: "Cairo, Egypt",
    rating: 4.9,
    reviews: 203,
    expertise: ["History", "Archaeology"],
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400&auto=format&fit=crop",
    verified: true,
  },
];

export default function TopRatedGuides() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Meet Our <span className="text-primary">Top-Rated Guides</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Passionate locals ready to share their city with you
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <div
              key={guide?.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={guide.image}
                    alt={guide.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  {guide.verified && (
                    <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
                  <div className="mt-2 flex items-center justify-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{guide.location}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{guide.rating}</span>
                    </div>
                    <span className="text-gray-500">({guide.reviews} reviews)</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {guide.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/guides/${guide?.id}`}
                    className="mt-6 inline-block w-full rounded-lg bg-primary py-2 text-center text-white hover:bg-primary/90"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 font-medium text-primary hover:bg-primary hover:text-white"
          >
            Browse All Guides
          </Link>
        </div>
      </div>
    </section>
  );
}