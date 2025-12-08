"use client";

import { useState } from "react";
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Shield, 
  CheckCircle,
  MessageSquare,
  Heart,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import BookingModal from "./BookingModal";
// import ReviewsSection from "./ReviewsSection";

interface Tour {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  location: string;
  meetingPoint: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  guide: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    yearsExperience: number;
    description: string;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: Array<{
    time: string;
    activity: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface TourDetailsProps {
  tour: Tour;
}

const TourDetails = ({ tour }: TourDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Mock data if API doesn't provide all fields
  const completeTour: Tour = {
    ...tour,
    detailedDescription: tour.detailedDescription || tour.description + " This tour offers an immersive experience where you'll get to know the local culture, traditions, and hidden gems that typical tourists often miss. Our expert guide will ensure you have an unforgettable experience.",
    meetingPoint: tour.meetingPoint || "Central Station Main Entrance",
    images: tour.images || [tour.images || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"],
    inclusions: tour.inclusions || [
      "Local guide",
      "All food tastings",
      "Water bottle",
      "Local transportation",
      "Souvenir gift"
    ],
    exclusions: tour.exclusions || [
      "Hotel pickup/drop-off",
      "Personal expenses",
      "Gratuities (optional)",
      "Travel insurance"
    ],
    itinerary: tour.itinerary || [
      { time: "10:00 AM", activity: "Meeting Point", description: "Meet your guide at the designated location" },
      { time: "10:30 AM", activity: "Market Visit", description: "Explore the local market and learn about ingredients" },
      { time: "12:00 PM", activity: "Cooking Session", description: "Hands-on cooking class with local chef" },
      { time: "1:30 PM", activity: "Lunch", description: "Enjoy the meal you prepared" },
      { time: "3:00 PM", activity: "Cultural Walk", description: "Walk through historic neighborhood" },
      { time: "4:30 PM", activity: "Tasting Session", description: "Sample local delicacies" },
    ],
    faqs: tour.faqs || [
      { question: "What should I wear?", answer: "Comfortable walking shoes and weather-appropriate clothing." },
      { question: "Is this tour suitable for children?", answer: "Yes, children aged 6 and above are welcome." },
      { question: "What if it rains?", answer: "The tour operates rain or shine. We'll provide ponchos if needed." },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={completeTour.images[selectedImage]}
          alt={completeTour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                {completeTour.category}
              </span>
              <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                <span>{completeTour.rating}</span>
                <span className="ml-1">({completeTour.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {completeTour.title}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{completeTour.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {completeTour.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-blue-600" : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Tour image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-700 mb-6">{completeTour.detailedDescription}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold">{completeTour.duration} hours</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold">Max {completeTour.maxGroupSize}</div>
                  <div className="text-sm text-gray-600">Group Size</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold">Flexible</div>
                  <div className="text-sm text-gray-600">Dates Available</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold">Verified</div>
                  <div className="text-sm text-gray-600">Safe & Secure</div>
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Tour Itinerary</h3>
                <div className="space-y-4">
                  {completeTour.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-4 min-w-[100px] text-center">
                        {item.time}
                      </div>
                      <div>
                        <h4 className="font-bold">{item.activity}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Inclusions</h3>
                  <ul className="space-y-2">
                    {completeTour.inclusions.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Exclusions</h3>
                  <ul className="space-y-2">
                    {completeTour.exclusions.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center">
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Meet Your Guide</h2>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={completeTour.guide.avatar}
                      alt={completeTour.guide.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="h-3 w-3 fill-white mr-1" />
                    {completeTour.guide.rating}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{completeTour.guide.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Based in {completeTour.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{completeTour.guide.description || "Experienced local guide with extensive knowledge of the area and passion for sharing local culture."}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="font-bold">{completeTour.guide.yearsExperience || 5}</div>
                      <div className="text-sm text-gray-600">Years Exp</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{completeTour.guide.reviewCount || completeTour.reviewCount}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{completeTour.guide.languages?.length || 3}</div>
                      <div className="text-sm text-gray-600">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">100%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {completeTour.guide.languages?.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    )) || ["English", "Spanish", "French"].map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <Button variant="outline" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Guide
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {/* <ReviewsSection tourId={completeTour.id} /> */}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
                <div className="text-3xl font-bold mb-2">
                  ${completeTour.price}
                  <span className="text-lg text-gray-600 font-normal"> / person</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>Flexible dates available</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>{completeTour.duration} hours duration</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <span>Max {completeTour.maxGroupSize} travelers</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>Meeting point: {completeTour.meetingPoint}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-3 text-lg"
                  >
                    Book Now
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className={`h-5 w-5 mr-2 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Safety Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Your Safety is Our Priority
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Verified guides with background checks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Secure online payment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Flexible cancellation policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {/* {showBookingModal && (
        <BookingModal
          tour={completeTour}
          onClose={() => setShowBookingModal(false)}
        />
      )} */}
    </div>
  );
};

export default TourDetails;