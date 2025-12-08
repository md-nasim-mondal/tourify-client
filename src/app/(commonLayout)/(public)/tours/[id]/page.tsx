/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import TourDetails from "@/components/modules/tours/TourDetails";

interface TourDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: TourDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const response = await serverFetch.get(`/tours/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      const tour = data.data;
      
      return {
        title: `${tour.title} - Tourify`,
        description: tour.description,
        openGraph: {
          images: [tour.image],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  return {
    title: "Tour Details - Tourify",
    description: "Tour details page",
  };
}

export default async function TourDetailsPage({ params }: TourDetailsPageProps) {
  const { id } = await params;
  
  let tourData;
  
  try {
    const response = await serverFetch.get(`/tours/${id}`);
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    tourData = data.data;
  } catch (error) {
    notFound();
  }
  
  return <TourDetails tour={tourData} />;
}