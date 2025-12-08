import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const destinations = [
  {
    name: "Tokyo",
    country: "Japan",
    tours: 245,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
  },
  {
    name: "Paris",
    country: "France",
    tours: 189,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w-800&auto=format&fit=crop",
  },
  {
    name: "Bali",
    country: "Indonesia",
    tours: 156,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&auto=format&fit=crop",
  },
  {
    name: "New York",
    country: "USA",
    tours: 312,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    tours: 134,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    tours: 178,
    image: "https://images.unsplash.com/photo-1552465011-b4e30bf7349d?w=800&auto=format&fit=crop",
  },
];

export default function PopularDestinations() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="mt-2 text-gray-600">
              Discover amazing tours in top travel destinations
            </p>
          </div>
          <Link
            href="/destinations"
            className="hidden text-primary hover:underline md:block"
          >
            View all →
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/explore?city=${dest.name}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="relative h-64">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{dest.country}</span>
                  </div>
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  <p className="text-sm opacity-90">{dest.tours} tours available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}