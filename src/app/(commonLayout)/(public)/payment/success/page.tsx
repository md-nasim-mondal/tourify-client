"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { confirmStripePayment } from "@/services/payment/payment.service";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          const res = await confirmStripePayment(sessionId);
          if (res.success) {
            setPaymentStatus("success");
            setMessage("Your payment was successful!");
            toast.success("Payment successful! Your booking is confirmed.");
          } else {
            setPaymentStatus("failed");
            setMessage(res.message || "Payment verification failed.");
            toast.error(res.message || "Payment verification failed.");
          }
        } catch (error: unknown) {
          setPaymentStatus("failed");
          const msg = error instanceof Error ? error.message : "An error occurred during payment verification.";
          setMessage(msg);
          toast.error(msg);
        }
      } else {
        setPaymentStatus("failed");
        setMessage("No session ID found for payment verification.");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {paymentStatus === "loading" && (
          <>
            <Loader className="mx-auto h-16 w-16 animate-spin text-primary" />
            <h2 className="mt-6 text-2xl font-bold">Processing Payment</h2>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}
        {paymentStatus === "success" && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-2xl font-bold text-green-700">
              Payment Successful!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <Button asChild className="mt-8">
              <Link href="/dashboard/tourist/bookings">View My Bookings</Link>
            </Button>
          </>
        )}
        {paymentStatus === "failed" && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-2xl font-bold text-red-700">
              Payment Failed
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/explore">Try Another Tour</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-6 text-center">Loading...</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
