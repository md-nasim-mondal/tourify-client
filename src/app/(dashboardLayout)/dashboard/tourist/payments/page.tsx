import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

export default async function TouristPaymentsPage() {
  const token = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${envVariables.BASE_API_URL}/payments`, {
    cache: "no-store",
    headers: token ? { authorization: token } : undefined,
  });
  const json = await res.json();
  const payments: {
    id: string;
    status: string;
    amount: number;
    booking?: { listing?: { title?: string } };
  }[] = json?.data || [];

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>Payments</h1>
      <div className='space-y-3'>
        {payments.map((p) => (
          <div
            key={p.id}
            className='border rounded p-3 flex items-center justify-between'>
            <div>
              <p className='font-medium'>
                {p.booking?.listing?.title || "Booking"}
              </p>
              <p className='text-sm'>Amount: ${p.amount}</p>
              <p className='text-xs'>Status: {p.status}</p>
            </div>
            <div className='flex items-center gap-3'>
              {p.status === "PAID" && (
                <a
                  href={`${envVariables.BASE_API_URL}/payments/${p.id}/receipt`}
                  target='_blank'
                  className='rounded bg-primary text-white px-3 py-1 text-sm'>
                  Download Receipt
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
