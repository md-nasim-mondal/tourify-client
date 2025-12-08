import Link from "next/link";
import { Utensils, Castle, Mountain, Palette, Moon, ShoppingBag } from "lucide-react";

const categories = [
  { icon: Utensils, name: "Food & Drink", count: 1245, color: "bg-red-500" },
  { icon: Castle, name: "History & Culture", count: 892, color: "bg-amber-500" },
  { icon: Mountain, name: "Adventure", count: 567, color: "bg-emerald-500" },
  { icon: Palette, name: "Art & Photography", count: 432, color: "bg-purple-500" },
  { icon: Moon, name: "Nightlife", count: 321, color: "bg-blue-500" },
  { icon: ShoppingBag, name: "Shopping", count: 278, color: "bg-pink-500" },
];

export default function Categories() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Explore by <span className="text-primary">Category</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Find tours that match your interests
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className="group rounded-2xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{category.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{category.count.toLocaleString()} tours</p>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 rounded-2xl bg-linear-to-r from-primary to-secondary p-8 text-center text-white">
          <h3 className="text-2xl font-bold">Can&apos;t find what you&apos;re looking for?</h3>
          <p className="mt-2 opacity-90">
            Our guides can create custom tours just for you
          </p>
          <Link
            href="/custom-tour"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-medium text-primary hover:bg-gray-100"
          >
            Request Custom Tour
          </Link>
        </div>
      </div>
    </section>
  );
}