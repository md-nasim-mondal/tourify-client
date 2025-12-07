"use server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function resetPasswordAction(formData: FormData) {
  "use server";
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: token },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json?.message || "Failed to reset password" };
    return { success: true };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const token =
    (Array.isArray(searchParams?.token)
      ? searchParams?.token[0]
      : searchParams?.token) || "";
  return (
    <div className='max-w-md mx-auto py-12 px-4'>
      <h1 className='text-2xl font-semibold mb-6'>Reset Password</h1>
      <form
        action={async (formData: FormData) => {
          const result = await resetPasswordAction(formData);
          if (result.error) {
            alert(result.error);
          } else {
            alert("Password reset successful!");
          }
        }}
        className='space-y-4'>
        <input type='hidden' name='token' value={token} />
        <div>
          <label className='block text-sm font-medium'>New Password</label>
          <input
            name='password'
            type='password'
            required
            className='mt-1 w-full rounded border px-3 py-2'
          />
        </div>
        <button
          type='submit'
          className='w-full rounded bg-black text-white py-2'>
          Reset Password
        </button>
      </form>
    </div>
  );
}
