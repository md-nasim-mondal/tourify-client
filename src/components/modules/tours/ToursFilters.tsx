"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ToursFiltersProps {
  searchParams: Record<string, string>;
}

const categories = [
  "All Categories",
  "Food & Dining",
  "Adventure",
  "History & Culture",
  "Photography",
  "Beach & Relax",
  "Local Experiences",
  "Water Activities",
  "Hiking & Trekking",
];

const durations = [
  "Any Duration",
  "0-2 hours",
  "2-4 hours",
  "4-8 hours",
  "Full day",
  "Multi-day",
];

const ToursFilters = ({ searchParams }: ToursFiltersProps) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "All Categories");
  const [selectedDuration, setSelectedDuration] = useState(searchParams.duration || "Any Duration");

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }
    
    if (selectedDuration !== "Any Duration") {
      params.set("duration", selectedDuration);
    }
    
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }
    
    if (priceRange[1] < 500) {
      params.set("maxPrice", priceRange[1].toString());
    }

    window.location.href = `/tours?${params.toString()}`;
  };

  const clearFilters = () => {
    window.location.href = "/tours";
  };

  const hasActiveFilters = Object.keys(searchParams).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-bold mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Duration Filter */}
      <div>
        <h4 className="font-bold mb-3">Duration</h4>
        <div className="space-y-2">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedDuration === duration
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
};

export default ToursFilters;