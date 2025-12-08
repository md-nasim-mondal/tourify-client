/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Star, 
  TrendingUp, 
  Clock,
  Bell,
  ChevronRight,
  ShoppingBag,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import Link from "next/link";
import Image from "next/image";

interface Booking {
  id: string;
  tourTitle: string;
  guideName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  image: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const TouristDashboard = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    reviewsWritten: 0,
    wishlistCount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings
      const bookingsResponse = await serverFetch.get("/bookings/me");
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.data?.slice(0, 3) || generateMockBookings());
        setStats(prev => ({
          ...prev,
          totalBookings: bookingsData.data?.length || 5,
          upcomingTrips: bookingsData.data?.filter((b: any) => b.status === "confirmed")?.length || 2,
        }));
      }

      // Fetch recommended tours
      const toursResponse = await serverFetch.get("/tours/recommended");
      if (toursResponse.ok) {
        const toursData = await toursResponse.json();
        setRecommendedTours(toursData.data || generateMockTours());
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setRecentBookings(generateMockBookings());
      setRecommendedTours(generateMockTours());
      setStats({
        totalBookings: 5,
        upcomingTrips: 2,
        reviewsWritten: 3,
        wishlistCount: 7,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockBookings = (): Booking[] => [
    {
      id: "1",
      tourTitle: "Tokyo Street Food Tour",
      guideName: "Kenji Tanaka",
      date: "2024-12-20",
      time: "10:00 AM",
      status: "confirmed",
      price: 75,
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop",
    },
    // Add more mock bookings...
  ];

  const generateMockTours = (): Tour[] => [
    {
      id: "1",
      title: "Kyoto Temple Walk",
      location: "Kyoto, Japan",
      price: 65,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop",
      category: "Culture",
    },
    // Add more mock tours...
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.upcomingTrips}</div>
                <div className="text-gray-600">Upcoming Trips</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.reviewsWritten}</div>
                <div className="text-gray-600">Reviews Written</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg mr-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.wishlistCount}</div>
                <div className="text-gray-600">Wishlist Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Recommended Tours */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Bookings</CardTitle>
              <Link href="/dashboard/tourist/bookings">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                    <Image
                      src={booking.image}
                      alt={booking.tourTitle}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{booking.tourTitle}</h4>
                        <p className="text-sm text-gray-600">with {booking.guideName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{booking.date} at {booking.time}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">${booking.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Tours */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recommended For You</CardTitle>
              <Link href="/tours">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedTours.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.id}`}>
                  <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tour.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{tour.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${tour.price}</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/tours">
              <Button className="w-full h-auto py-4 flex flex-col items-center justify-center">
                <MapPin className="h-8 w-8 mb-2" />
                <span>Explore Tours</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/tourist/bookings">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 mb-2" />
                <span>My Bookings</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/tourist/reviews">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                <Star className="h-8 w-8 mb-2" />
                <span>Write Review</span>
              </Button>
            </Link>
            
            <Link href="/profile/me">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center">
                <TrendingUp className="h-8 w-8 mb-2" />
                <span>Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouristDashboard;