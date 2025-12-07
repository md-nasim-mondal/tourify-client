"use server";

import { envVariables } from "@/lib/env";


async function forgotPasswordAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  try {
    const res = await fetch(`${envVariables.BASE_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json?.message || "Failed to send reset link" };
    return { success: true };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export default async function ForgotPasswordPage() {
  return (
    <div className='max-w-md mx-auto py-12 px-4'>
      <h1 className='text-2xl font-semibold mb-6'>Forgot Password</h1>
      <form
        action={async (formData: FormData) => {
          await forgotPasswordAction(formData);
        }}
        className='space-y-4'>
        <div>
          <label className='block text-sm font-medium'>Email</label>
          <input
            name='email'
            type='email'
            required
            className='mt-1 w-full rounded border px-3 py-2'
          />
        </div>
        <button
          type='submit'
          className='w-full rounded bg-black text-white py-2'>
          Send Reset Link
        </button>
      </form>
      <p className='mt-4 text-sm text-zinc-600'>
        Check your email for the reset link.
      </p>
    </div>
  );
}
