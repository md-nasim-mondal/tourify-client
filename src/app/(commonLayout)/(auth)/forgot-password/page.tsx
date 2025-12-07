import ForgotPasswordForm from "@/components/modules/auth/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password - Tourify",
  description: "Reset your Tourify account password.",
};

const ForgotPasswordPage = () => {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
            
            {/* Back to login link at bottom */}
            <div className="mt-6 pt-4 border-t text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:underline inline-flex items-center"
              >
                ← Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;