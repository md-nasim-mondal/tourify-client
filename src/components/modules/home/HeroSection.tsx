"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    title: "Discover the Unseen World",
    subtitle: "Connect with passionate local experts and experience cities like never before.",
    highlight: "Unseen World"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1533929736472-594e45db7154?q=80&w=2070&auto=format&fit=crop",
    title: "Taste the Authentic Culture",
    subtitle: "From street food to fine dining, explore the flavors that define a destination.",
    highlight: "Authentic Flavors"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
    title: "Adventure Awaits You",
    subtitle: "Find hidden gems and thrilling activities curated just for you.",
    highlight: "True Adventure"
  }
];

export default function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-slate-900">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            <div className="absolute inset-0">
               <Image 
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  className="object-cover opacity-60"
                  priority={slide.id === 1}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
               <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
            </div>

            <div className="relative z-10 flex h-full items-center justify-center px-4 pt-20 text-center">
              <div className="max-w-4xl animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-lg">
                    {slide.title.replace(slide.highlight, "")}
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                      {slide.highlight}
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-gray-200 md:text-2xl max-w-2xl mx-auto drop-shadow-md font-medium">
                    {slide.subtitle}
                  </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Search Overlay - Positioned securely over the slider */}
      <div className="absolute bottom-12 left-0 right-0 z-20 px-4 md:bottom-20">
         <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-3xl"
         >
            <form action="/explore" method="GET" className="relative group">
               <div className="relative flex items-center p-2 bg-white/95 backdrop-blur-md dark:bg-slate-900/90 rounded-2xl shadow-2xl ring-1 ring-white/20 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:scale-[1.01]">
               <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <input
                     type="text"
                     name="searchTerm"
                     placeholder="Where's your next adventure?"
                     className="w-full bg-transparent py-4 pl-12 pr-4 text-lg outline-none placeholder:text-muted-foreground text-foreground"
                     required
                  />
               </div>
               <Button type="submit" size="lg" className="rounded-xl px-8 h-14 text-base font-bold shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90">
                  Explore Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </Button>
               </div>
            </form>
         </motion.div>
      </div>
    </section>
  );
}