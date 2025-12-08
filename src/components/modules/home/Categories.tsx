"use client";

import { Camera, Utensils, Mountain, Castle, Palmtree, Coffee, Waves, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  {
    icon: <Camera className="h-8 w-8" />,
    title: "Photography Tours",
    count: 45,
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Utensils className="h-8 w-8" />,
    title: "Food & Dining",
    count: 68,
    color: "bg-red-100 text-red-600",
  },
  {
    icon: <Mountain className="h-8 w-8" />,
    title: "Adventure",
    count: 92,
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <Castle className="h-8 w-8" />,
    title: "History & Culture",
    count: 57,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <Palmtree className="h-8 w-8" />,
    title: "Beach & Relax",
    count: 34,
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Coffee className="h-8 w-8" />,
    title: "Local Experiences",
    count: 78,
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: <Waves className="h-8 w-8" />,
    title: "Water Activities",
    count: 41,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: <TreePine className="h-8 w-8" />,
    title: "Hiking & Trekking",
    count: 63,
    color: "bg-orange-100 text-orange-600",
  },
];

const Categories = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore By Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find tours that match your interests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/tours?category=${category.title.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${category.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {category.count} tours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;