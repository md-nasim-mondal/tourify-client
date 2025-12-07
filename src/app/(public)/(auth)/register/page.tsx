import RegisterForm from "@/components/modules/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Tourify",
  description: "Create a new account to start your journey with Tourify.",
};

export default function RegisterPage() {
  return (
    <div className='max-w-md mx-auto py-12 px-4'>
      <h1 className='text-2xl font-semibold mb-6'>Create an account</h1>

      <RegisterForm />

      <p className='mt-4 text-sm text-zinc-600'>
        After registering, please check your email to verify your account.
      </p>
    </div>
  );
}
