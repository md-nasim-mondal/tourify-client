import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <CheckCircle className='h-12 w-12 text-green-500' />
            </div>
            <CardTitle>Password Reset Successful!</CardTitle>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            <p className='text-gray-600'>
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
            <Button asChild className='w-full'>
              <Link href='/login'>Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
