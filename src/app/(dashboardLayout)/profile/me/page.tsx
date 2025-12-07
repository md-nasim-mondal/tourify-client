"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";


export default async function MyProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/users/me`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const me: { name: string; email: string; bio?: string; contactNo?: string; address?: string; photo?: string } = json?.data || {};

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="border rounded p-4">
        <p className="font-medium">{me.name}</p>
        <p className="text-sm text-zinc-600">{me.email}</p>
        {me.bio && <p className="mt-2">{me.bio}</p>}
        {me.contactNo && <p className="text-sm mt-1">Contact: {me.contactNo}</p>}
        {me.address && <p className="text-sm mt-1">Address: {me.address}</p>}
      </div>
    </div>
  );
}
