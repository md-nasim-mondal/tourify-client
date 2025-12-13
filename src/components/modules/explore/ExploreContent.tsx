
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TourList from "./TourList";
import TourMap from "./TourMap";
import { Map, List } from "lucide-react";

export default function ExploreContent({ listingsData }: { listingsData: any }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          {showMap ? (
            <>
              <List className="h-4 w-4" />
              Show List
            </>
          ) : (
            <>
              <Map className="h-4 w-4" />
              Show Map
            </>
          )}
        </Button>
      </div>

      {showMap ? (
        <TourMap listings={listingsData?.data || []} />
      ) : (
        <TourList listingsData={listingsData} />
      )}
    </div>
  );
}
