"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Clock } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          
          <p className="text-xl mb-10 text-white/90">
            Join thousands of travelers who have discovered the world with local experts.
            Create unforgettable memories today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tours">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Explore Tours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Verified Guides</h3>
                <p className="text-white/80">
                  All guides are thoroughly vetted and verified
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Global Coverage</h3>
                <p className="text-white/80">
                  Tours available in 50+ countries worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-white/80">
                  Round-the-clock customer support available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;