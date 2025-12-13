/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, TrendingUp } from "lucide-react";
import { getBookings } from "@/services/booking/booking.service";
import { getDashboardMetadata } from "@/services/meta/meta.service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tourist Dashboard - Tourify",
};

export default async function TouristDashboardPage() {
  const [bookings, metadata] = await Promise.all([
    getBookings({ limit: 5 }),
    getDashboardMetadata(),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-linear-to-r from-primary to-secondary p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="mt-2 opacity-90">Manage your tours, bookings, and reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold">{metadata?.totalBookings || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Trips</p>
                <p className="text-2xl font-bold">{metadata?.upcomingTrips || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Trips</p>
                <p className="text-2xl font-bold">{metadata?.completedTrips || 0}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${Number(metadata?.totalSpend || 0).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button asChild variant="outline">
              <Link href="/dashboard/tourist/bookings">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bookings?.data?.length > 0 ? (
            <div className="space-y-4">
              {bookings?.data?.map((booking: any) => (
                <div key={booking?.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">{booking.listing?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${booking.totalPrice}</p>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      booking.status === "CONFIRMED" 
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings yet</p>
              <Button asChild className="mt-4">
                <Link href="/explore">Explore Tours</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/explore">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8" />
                  <span>Explore New Tours</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/dashboard/tourist/bookings">
                <div className="text-center">
                  <Calendar className="mx-auto mb-2 h-8 w-8" />
                  <span>Manage Bookings</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/dashboard/tourist/reviews">
                <div className="text-center">
                  <Star className="mx-auto mb-2 h-8 w-8" />
                  <span>Write Reviews</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
