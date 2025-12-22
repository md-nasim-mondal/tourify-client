import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email - Tourify",
  description: "Verify your email address to access your account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailClient />
    </Suspense>
  );
}
