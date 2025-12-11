"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { serverFetch } from "@/lib/server-fetch";
import { toast } from "sonner";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setError("No verification token provided");
        return;
      }

      setIsLoading(true);
      try {
        const res = await serverFetch.post("/auth/verify-email", {
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        if (!result.success) {
          setError(result.message || "Email verification failed");
          toast.error(result.message || "Email verification failed");
          return;
        }

        setIsVerified(true);
        toast.success("Email verified successfully!");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during verification";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmailToken();
    }
  }, [router, token]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-white to-secondary/5 px-4 py-12'>
      <div className='w-full max-w-md'>
        <Card className='shadow-lg border-0'>
          <CardHeader className='text-center pb-4'>
            <div className='flex justify-center mb-4'>
              {isLoading && (
                <Loader2 className='w-12 h-12 text-primary animate-spin' />
              )}
              {isVerified && !isLoading && (
                <CheckCircle className='w-12 h-12 text-green-500' />
              )}
              {error && !isLoading && (
                <AlertCircle className='w-12 h-12 text-red-500' />
              )}
            </div>
            <CardTitle className='text-2xl'>
              {isLoading && "Verifying Email..."}
              {isVerified && "Email Verified!"}
              {error && "Verification Failed"}
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            {isLoading && (
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>
                  Please wait while we verify your email address...
                </p>
                <p className='text-sm text-gray-400'>
                  This may take a few moments
                </p>
              </div>
            )}

            {isVerified && !isLoading && (
              <div className='space-y-4 text-center'>
                <p className='text-gray-600'>
                  Your email has been successfully verified! 🎉
                </p>
                <p className='text-sm text-gray-500'>
                  You can now log in to your account and start exploring amazing
                  tours.
                </p>
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                  <p className='text-sm text-green-700'>
                    Redirecting to login page...
                  </p>
                </div>
                <Link href='/login' className='inline-block'>
                  <Button className='w-full'>Go to Login</Button>
                </Link>
              </div>
            )}

            {error && !isLoading && (
              <div className='space-y-4'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <p className='text-sm text-red-700'>{error}</p>
                  <p className='text-xs text-red-600 mt-2'>
                    The verification link may have expired. Please register
                    again or contact support.
                  </p>
                </div>
                <div className='space-y-2'>
                  <Link href='/register' className='block'>
                    <Button variant='outline' className='w-full'>
                      Back to Registration
                    </Button>
                  </Link>
                  <Link href='/login' className='block'>
                    <Button className='w-full'>Go to Login</Button>
                  </Link>
                </div>
              </div>
            )}

            {!isLoading && !isVerified && !error && (
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>
                  No verification token found. Please check your email for the
                  verification link.
                </p>
                <Link href='/register'>
                  <Button variant='outline' className='w-full'>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Registration
                  </Button>
                </Link>
              </div>
            )}

            <div className='text-center text-xs text-gray-400 mt-4'>
              <p>
                Need help?{" "}
                <Link href='/contact' className='text-primary hover:underline'>
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
