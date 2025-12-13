"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white/50 dark:bg-slate-950/50 py-24 md:py-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
              Discover the <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Unseen World
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto"
          >
            Connect with passionate local experts and experience cities like never before.
          </motion.p>

          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <form action="/explore" method="GET" className="mx-auto max-w-3xl">
              <div className="relative flex items-center p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    name="searchTerm"
                    placeholder="Where's your next adventure?"
                    className="w-full bg-transparent py-4 pl-12 pr-4 text-lg outline-none placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:scale-105 transition-transform">
                  Explore
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="py-1">Trending Destinations:</span>
              {["Kyoto", "Marrakech", "New York", "Santorini", "Cape Town"].map((city, idx) => (
                <motion.a
                  key={city}
                  href={`/explore?city=${city}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="rounded-full bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 px-4 py-1 font-medium text-secondary-foreground transition-colors"
                >
                  {city}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}