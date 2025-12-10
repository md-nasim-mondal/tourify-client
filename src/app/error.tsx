"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    toast.error(error.message || "Something went wrong. Please try again.");
  }, [error]);

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6'>
      <div className='w-full max-w-xl'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center'>
              <AlertTriangle className='h-10 w-10 text-red-600' />
            </div>
            <CardTitle className='mt-4'>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            <p className='text-gray-600'>
              Please try again or go back to the home page.
            </p>
            <div className='flex items-center justify-center gap-2'>
              <Button onClick={() => reset()}>Try Again</Button>
              <Button asChild variant='outline'>
                <Link href='/'>Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
