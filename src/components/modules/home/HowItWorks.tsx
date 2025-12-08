import { Search, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse thousands of unique tours led by passionate local experts",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Choose your preferred date and book instantly with secure payment",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Star,
    title: "Experience",
    description: "Enjoy authentic local experiences and create unforgettable memories",
    color: "from-amber-500 to-orange-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            How <span className="text-primary">Tourify</span> Works
          </h2>
          <p className="mt-4 text-gray-600">
            Three simple steps to your perfect local experience
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg font-bold text-primary shadow-lg">
                {index + 1}
              </div>
              
              {/* Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 pt-12 shadow-lg transition-all hover:shadow-xl">
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br ${step.color}`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}