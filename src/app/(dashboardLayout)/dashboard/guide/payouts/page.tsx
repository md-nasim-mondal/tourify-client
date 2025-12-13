
export const dynamic = "force-dynamic";
import { serverFetch } from "@/lib/server-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function GuidePayoutsPage() {
  const res = await serverFetch.get("/payments/my-payments");
  const json = await res.json();
  
  // Adjusted for new API shape: data: { payments: [], totalEarnings: 0 }
  const payments = json?.data?.payments || [];
  const totalEarnings = json?.data?.totalEarnings || 0;

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>My Payouts</h1>
        <p className='text-muted-foreground'>
          Track your earnings and payouts.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>${totalEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="opacity-70">
            <CardHeader>
                <CardTitle>Pending Payout</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">$0.00</p>
                <p className="text-sm text-muted-foreground">Payouts are processed weekly.</p>
            </CardContent>
        </Card>
      </div>

      <div className='border rounded-lg'>
        <div className='p-4 border-b bg-muted/50'>
            <h2 className='font-semibold'>Payment History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Tourist</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{p.booking?.listing?.title}</TableCell>
                  <TableCell>
                    {p.booking?.tourist?.name} <br />
                    <span className='text-xs text-muted-foreground'>
                      {p.booking?.tourist?.email}
                    </span>
                  </TableCell>
                  <TableCell className='font-bold'>
                    ${p.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className='px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
                      {p.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8'>
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
