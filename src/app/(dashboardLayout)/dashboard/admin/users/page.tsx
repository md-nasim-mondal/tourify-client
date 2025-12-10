"use server";
import { serverFetch } from "@/lib/server-fetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserManagementActions from "@/components/modules/admin/UserManagementActions";
import { Badge } from "@/components/ui/badge";

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
};

export default async function AdminUsersPage() {
  const res = await serverFetch.get(`/users?limit=50`); // Fetch more users
  const json = await res.json();
  const users: User[] = json?.data || [];

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <div className="mb-6">
        <h1 className='text-3xl font-bold'>Manage Users</h1>
        <p className="text-muted-foreground">Update user roles and statuses.</p>
      </div>
      <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                        <TableCell><Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <UserManagementActions user={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
