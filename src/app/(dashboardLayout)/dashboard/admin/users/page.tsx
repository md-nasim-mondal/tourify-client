"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";


async function updateUserStatusAction(id: string, formData: FormData) {
  'use server'
  const token = (await cookies()).get("accessToken")?.value;
  const status = String(formData.get("status") || "ACTIVE");
  if (!token) return;
  await fetch(`${envVariables.BASE_API_URL}/users/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ status }),
  });
}

async function updateUserRoleAction(id: string, formData: FormData) {
  'use server'
  const token = (await cookies()).get("accessToken")?.value;
  const role = String(formData.get("role") || "TOURIST");
  if (!token) return;
  await fetch(`${envVariables.BASE_API_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: token },
    body: JSON.stringify({ role }),
  });
}

export default async function AdminUsersPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/users?limit=20`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const users: { id: string; email: string; name: string; role: string; status: string }[] = json?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{u.name} — {u.email}</p>
                <p className="text-sm text-zinc-600">Role: {u.role} | Status: {u.status}</p>
              </div>
              <div className="flex gap-2">
                <form action={updateUserStatusAction.bind(null, u.id)} className="flex gap-2">
                  <select name="status" defaultValue={u.status} className="rounded border px-2 py-1">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                  <button type="submit" className="rounded bg-black text-white px-3 py-1">Update Status</button>
                </form>
                <form action={updateUserRoleAction.bind(null, u.id)} className="flex gap-2">
                  <select name="role" defaultValue={u.role} className="rounded border px-2 py-1">
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="GUIDE">GUIDE</option>
                    <option value="TOURIST">TOURIST</option>
                  </select>
                  <button type="submit" className="rounded bg-black text-white px-3 py-1">Update Role</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
