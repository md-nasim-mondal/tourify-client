
export const dynamic = "force-dynamic";
import { serverFetch } from "@/lib/server-fetch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserManagementActions from "@/components/modules/admin/UserManagementActions";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination-controls"; // Need to ensure this path is correct based on where we create it
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    searchTerm?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page || "1";
  const searchTerm = params.searchTerm || "";

  const query = new URLSearchParams({
    page,
    limit: "10",
    ...(searchTerm && { searchTerm }),
  }).toString();

  const res = await serverFetch.get(`/users?${query}`);
  const json = await res.json();
  const users: User[] = json?.data || [];
  const meta = json?.meta || { page: 1, limit: 10, total: 0 };

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Manage Users</h1>
          <p className='text-muted-foreground'>
            View and manage all registered users.
          </p>
        </div>
        
        <form className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                   name="searchTerm" 
                   placeholder="Search users..." 
                   defaultValue={searchTerm}
                   className="pl-9 w-[250px]"
                />
            </div>
            <Button type="submit">Search</Button>
        </form>
      </div>

      <div className='border rounded-lg bg-white overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User Details</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='font-medium'>{user.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <UserManagementActions user={user} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        <div className="px-4">
             <Pagination meta={meta} />
        </div>
      </div>
    </div>
  );
}
