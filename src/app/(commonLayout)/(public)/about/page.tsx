import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
          alt="Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            About Tourify
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Connecting travelers with authentic local experiences since 2024.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Tourify, we believe that the best way to experience a place is through the eyes of a local. We are dedicated to empowering local guides to share their passion and culture with travelers from around the world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
               Our platform ensures secure bookings, verified guides, and unforgettable memories. We are committed to sustainable tourism that benefits local communities.
            </p>
            <div className="pt-4">
               <Button asChild size="lg">
                  <Link href="/explore">Start Exploring</Link>
               </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1887&auto=format&fit=crop"
              alt="Mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
               <h3 className="text-4xl font-bold text-primary">10k+</h3>
               <p className="text-muted-foreground">Happy Travelers</p>
            </div>
            <div className="space-y-2">
               <h3 className="text-4xl font-bold text-primary">500+</h3>
               <p className="text-muted-foreground">Expert Guides</p>
            </div>
            <div className="space-y-2">
               <h3 className="text-4xl font-bold text-primary">50+</h3>
               <p className="text-muted-foreground">Destinations</p>
            </div>
            <div className="space-y-2">
               <h3 className="text-4xl font-bold text-primary">4.9</h3>
               <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}