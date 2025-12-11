import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className='max-w-2xl mx-auto py-16 px-4 flex items-center justify-center'>
      <Card className='text-center'>
        <CardHeader>
          <div className='mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center'>
            <XCircle className='h-10 w-10 text-red-600' />
          </div>
          <CardTitle className='mt-4'>Payment Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t process your payment. Please try again or use
            another method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center gap-2'>
            <Button asChild>
              <Link href='/dashboard/tourist/bookings'>
                Back to My Bookings
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/explore'>Explore Tours</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
