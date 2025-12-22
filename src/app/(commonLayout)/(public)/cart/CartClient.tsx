"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, CreditCard, Calendar, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { submitBulkBooking } from "@/actions/booking";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth protection
  useEffect(() => {
      if (!loading && !user) {
         toast.error("Please login to view your cart");
         router.push("/login?redirect=/cart");
      }
  }, [user, loading, router]);

  const handleRemove = (cartId: string) => {
      removeFromCart(cartId);
      toast.success("Item removed from cart");
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const handleCheckoutAll = async () => {
      if (!user) {
          toast.error("Please login to checkout");
          router.push("/login?redirect=/cart");
          return;
      }
      setIsProcessing(true);
      toast.info("Sending booking requests...");
      
      try {
          const res = await submitBulkBooking(cart);
          if (res.success) {
              toast.success(res.message);
              clearCart();
              router.push("/dashboard/tourist/bookings");
          } else {
              toast.error(res.message);
          }
      } catch (error) {
          toast.error("An unexpected error occurred.");
      } finally {
          setIsProcessing(false);
      }
  }

  if (!mounted || loading) return (
      <div className="min-h-screen container mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
           {[1, 2].map(i => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
           ))}
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
           <span className="bg-primary/10 p-2 rounded-lg">
              <CreditCard className="h-8 w-8 text-primary" />
           </span>
           Your Cart 
           <span className="text-lg font-normal text-muted-foreground ml-2">
             ({cart.length} {cart.length === 1 ? 'item' : 'items'})
           </span>
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item: any) => (
                <Card key={item.cartId} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                      <Image
                        src={item.image || "/placeholder-tour.jpg"}
                        alt={item.title || "Tour Image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                           <p className="font-bold text-primary text-lg">${item.totalPrice}</p>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mt-2">
                           <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(item.date), "PPP")}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{item.groupSize} Guests</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 pt-4 border-t gap-3">
                         <Button variant="outline" size="sm" onClick={() => handleRemove(item.cartId)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                         </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full h-12 text-base" 
                    size="lg" 
                    disabled={cart.length === 0 || isProcessing} 
                    onClick={handleCheckoutAll}
                  >
                    {isProcessing ? "Processing..." : "Request Booking (All)"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-gray-300" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
             <p className="text-gray-500 max-w-sm mx-auto mb-8">
               Looks like you haven't booked any tours yet.
             </p>
             <Button asChild size="lg">
                <Link href="/explore">Start Exploring</Link>
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
