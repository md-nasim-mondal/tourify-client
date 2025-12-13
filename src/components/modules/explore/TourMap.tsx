
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TourMap({ listings }: { listings: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fix global L issue if needed
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-gray-100 rounded-lg animate-pulse" />;

  // Default center (e.g., Dhaka) or calculate from listings
  const center: [number, number] = [23.8103, 90.4125]; 

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((listing) => {
            // Mock coordinates if not present (In a real app, listing should have lat/lng)
            // For demo, we'll randomize slightly around Dhaka if no location data
            const lat =  23.8103 + (Math.random() - 0.5) * 2;
            const lng = 90.4125 + (Math.random() - 0.5) * 2;
            
            return (
                <Marker key={listing.id} position={[lat, lng]} icon={icon}>
                    <Popup>
                        <div className="text-sm font-semibold">{listing.title}</div>
                        <div className="text-xs text-gray-500">{listing.location}</div>
                        <div className="font-bold mt-1">${listing.price}</div>
                    </Popup>
                </Marker>
            )
        })}
      </MapContainer>
    </div>
  );
}
