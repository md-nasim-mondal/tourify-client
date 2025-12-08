"use client";

import { Search, Calendar, Users, Star } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-12 w-12" />,
    title: "Find Your Tour",
    description: "Browse through thousands of curated tours and experiences.",
  },
  {
    icon: <Calendar className="h-12 w-12" />,
    title: "Book Instantly",
    description: "Select your dates and book with secure payment.",
  },
  {
    icon: <Users className="h-12 w-12" />,
    title: "Meet Your Guide",
    description: "Connect with your verified local guide before the tour.",
  },
  {
    icon: <Star className="h-12 w-12" />,
    title: "Enjoy & Review",
    description: "Experience your tour and share your feedback.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Tourify Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to your perfect travel experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 text-blue-600">
                  {step.icon}
                </div>
                
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;