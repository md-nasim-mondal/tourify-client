import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-white to-secondary/5 py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Explore the World with{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Local Experts
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            Discover hidden gems, authentic experiences, and unforgettable stories with passionate local guides around the globe.
          </p>
          
          {/* Search Form */}
          <div className="mt-10">
            <form action="/explore" method="GET" className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="searchTerm"
                    placeholder="Where do you want to explore?"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 shadow-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-xl px-8 shadow-lg">
                  Search Tours
                </Button>
              </div>
            </form>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
              <span>Popular:</span>
              {["Paris", "Tokyo", "Bali", "New York", "Istanbul"].map((city) => (
                <a
                  key={city}
                  href={`/explore?city=${city}`}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-gray-50"
                >
                  {city}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}