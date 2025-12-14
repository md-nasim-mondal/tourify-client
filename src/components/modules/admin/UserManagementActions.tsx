"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/services/user/updateUser";
import { useState } from "react";
import { toast } from "sonner";

type UserManagementActionsProps = {
    user: {
        id: string;
        role: string;
        status: string;
    }
};

const ROLES = ["SUPER_ADMIN", "ADMIN", "GUIDE", "TOURIST"];
const STATUSES = ["ACTIVE", "BLOCKED", "DELETED"];

export default function UserManagementActions({ user }: UserManagementActionsProps) {
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status);
    const [isLoading, setIsLoading] = useState<"role" | "status" | null>(null);

    const handleUpdateRole = async () => {
        setIsLoading("role");
        const result = await updateUser(user.id, { role });
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
            setRole(user.role); // Revert on failure
        }
        setIsLoading(null);
    };

    const handleUpdateStatus = async () => {
        setIsLoading("status");
        const result = await updateUser(user.id, { status });
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
            setStatus(user.status); // Revert on failure
        }
        setIsLoading(null);
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button size="sm" onClick={handleUpdateRole} disabled={isLoading === 'role' || role === user.role}>
                    {isLoading === 'role' ? '...' : 'Set Role'}
                </Button>
            </div>
             <div className="flex items-center gap-2">
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Button size="sm" onClick={handleUpdateStatus} disabled={isLoading === 'status' || status === user.status}>
                    {isLoading === 'status' ? '...' : 'Set Status'}
                </Button>
            </div>
        </div>
    );
}
