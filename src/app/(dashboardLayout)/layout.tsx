import React from "react";
import AppSidebar from "@/components/modules/dashboard/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-gray-50/50'>
      <AppSidebar />
      <main className='flex-1 overflow-y-auto w-full'>
          <div className="p-4 md:p-8 pt-16 md:pt-8 w-full max-w-7xl mx-auto">
             {children}
          </div>
      </main>
    </div>
  );
}
