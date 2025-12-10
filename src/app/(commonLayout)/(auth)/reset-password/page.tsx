import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Tourify",
  description: "Reset your Tourify account password.",
};

interface ResetPasswordPageProps {
  searchParams?: {
    token?: string;
  };
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
  const token = searchParams?.token || "";

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className='py-6 text-center'>Loading...</div>}>
              <ResetPasswordForm token={token} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
