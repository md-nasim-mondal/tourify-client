import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";
import { releasePayout } from "@/services/payment/payment.service";
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
    booking?: { status?: string; listing?: { title?: string } };
    paymentGatewayData?: Record<string, unknown> | null;
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
            className='border rounded p-3 flex items-center justify-between gap-3'>
            <div>
              <p className='font-medium'>
                {p.booking?.listing?.title || "Booking"}
              </p>
              <p className='text-xs'>Status: {p.status}</p>
              <p className='text-xs'>Booking: {p.booking?.status}</p>
              {typeof p.paymentGatewayData === "object" &&
                p.paymentGatewayData !== null &&
                "payoutReleasedAt" in p.paymentGatewayData && (
                  <p className='text-xs'>Payout: Released</p>
                )}
            </div>
            <div className='flex items-center gap-3'>
              <p className='font-medium'>${p.amount || 0}</p>
              {p.status === "PAID" &&
                p.booking?.status === "COMPLETED" &&
                !(
                  typeof p.paymentGatewayData === "object" &&
                  p.paymentGatewayData !== null &&
                  "payoutReleasedAt" in p.paymentGatewayData
                ) && (
                  <form action={releasePayout}>
                    <input type='hidden' name='paymentId' value={p.id} />
                    <button className='px-3 py-2 text-sm rounded bg-indigo-600 text-white'>
                      Release Payout
                    </button>
                  </form>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
