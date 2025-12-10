"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, Tag, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ExploreFiltersProps = {
  categories: string[];
  languages: string[];
};

export default function ExploreFilters({ categories, languages }: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (city) params.set("city", city);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLanguage) params.set("language", selectedLanguage);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString());
    
    router.push(`/explore?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCity("");
    setSelectedCategory("");
    setSelectedLanguage("");
    setPriceRange([0, 1000]);
    router.push("/explore");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="city"
              placeholder="City or country"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={`cat-${category}`}
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-2"
                  />
                  <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Any Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button onClick={applyFilters} className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}