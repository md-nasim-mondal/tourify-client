import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-6 text-2xl font-bold text-red-700">Payment Cancelled</h2>
        <p className="mt-2 text-gray-600">
          Your payment was cancelled. You can try again or explore other tours.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/explore">Explore Tours</Link>
          </Button>
          {/* Optionally, add a button to retry payment if context allows */}
        </div>
      </div>
    </div>
  );
}