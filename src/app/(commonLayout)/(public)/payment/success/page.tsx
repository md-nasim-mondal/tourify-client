import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";
import { Metadata } from "next";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Success - Tourify",
  description: "Your payment was successful.",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
         <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <PaymentSuccessClient />
    </Suspense>
  );
}
