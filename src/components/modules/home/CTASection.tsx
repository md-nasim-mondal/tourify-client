import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl bg-linear-to-r from-primary via-primary/90 to-secondary p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Ready to Share Your City?
              </h2>
              <p className="mt-4 text-white/90">
                Join our community of passionate local guides and turn your knowledge into income.
                Share your favorite spots, hidden gems, and local stories with travelers from around the world.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/become-guide"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-primary hover:bg-gray-100"
                >
                  Become a Guide
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/guide-benefits"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 font-medium text-white hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">$2,500+</div>
                  <div className="mt-2 text-white/80">Average Monthly Earnings</div>
                </div>
                <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">Flexible</div>
                  <div className="mt-2 text-white/80">Choose Your Own Schedule</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="mt-2 text-white/80">Support & Training</div>
                </div>
                <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">Global</div>
                  <div className="mt-2 text-white/80">Traveler Network</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}