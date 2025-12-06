/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function loginAction(formData: FormData) {
  "use server";
  const cookieStore = await cookies();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTarget = String(formData.get("redirect") || "");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) {
      return { error: json?.message || "Login failed" };
    }
    const token = json?.data?.accessToken as string | undefined;
    if (!token) {
      return { error: "No access token returned" };
    }
    cookieStore.set("accessToken", token, { path: "/" });
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const role = payload?.role as string | undefined;
    if (redirectTarget) {
      return redirect(redirectTarget);
    }
    if (role === "ADMIN" || role === "SUPER_ADMIN")
      redirect("/dashboard/admin");
    if (role === "GUIDE") redirect("/dashboard/guide");
    redirect("/dashboard/tourist");
  } catch (_err: unknown) {
    return { error: "Network error. Please try again." };
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const redirectTo =
    (Array.isArray(searchParams?.redirect)
      ? searchParams?.redirect[0]
      : searchParams?.redirect) || "";
  return (
    <div className='max-w-md mx-auto py-12 px-4'>
      <h1 className='text-2xl font-semibold mb-6'>Login</h1>
      <form
        action={
          loginAction as unknown as (formData: FormData) => void | Promise<void>
        }
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
        <div>
          <label className='block text-sm font-medium'>Password</label>
          <input
            name='password'
            type='password'
            required
            className='mt-1 w-full rounded border px-3 py-2'
          />
        </div>
        {redirectTo && (
          <input type='hidden' name='redirect' value={redirectTo} />
        )}
        <button
          type='submit'
          className='w-full rounded bg-black text-white py-2'>
          Login
        </button>
      </form>
    </div>
  );
}
