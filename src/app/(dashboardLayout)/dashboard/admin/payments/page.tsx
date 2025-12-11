import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/payments?limit=200`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const payments: {
    id: string;
    status: string;
    amount?: number;
    booking?: { listing?: { title?: string } };
  }[] = json?.data || [];
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>All Payments</h1>
        <div className='border rounded p-3'>
          <p className='text-sm'>Total Amount</p>
          <p className='text-xl font-bold'>${total}</p>
        </div>
      </div>
      <div className='space-y-3'>
        {payments.map((p) => (
          <div
            key={p.id}
            className='border rounded p-3 flex items-center justify-between'>
            <div>
              <p className='font-medium'>
                {p.booking?.listing?.title || "Booking"}
              </p>
              <p className='text-xs'>Status: {p.status}</p>
            </div>
            <p className='font-medium'>${p.amount || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
