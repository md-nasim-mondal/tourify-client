"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  LayoutDashboard,
  ListChecks,
  CalendarCheck,
  ShoppingCart,
  Users,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/modules/auth/LogoutButton";
import { getUserInfo } from "@/services/auth/getUserInfo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    name?: string;
    photo?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const info = await getUserInfo();
      setUser(info);
    })();
  }, []);

  const links = [
    {
      href: "/dashboard/tourist",
      label: "Tourist Home",
      icon: LayoutDashboard,
      roles: ["TOURIST"],
    },
    {
      href: "/dashboard/tourist/bookings",
      label: "My Bookings",
      icon: CalendarCheck,
      roles: ["TOURIST"],
    },
    {
      href: "/dashboard/tourist/reviews",
      label: "My Reviews",
      icon: StarIcon,
      roles: ["TOURIST"],
    },

    {
      href: "/dashboard/guide",
      label: "Guide Home",
      icon: LayoutDashboard,
      roles: ["GUIDE"],
    },
    {
      href: "/dashboard/guide/listings",
      label: "My Listings",
      icon: ListChecks,
      roles: ["GUIDE"],
    },
    {
      href: "/dashboard/guide/bookings",
      label: "Bookings",
      icon: ShoppingCart,
      roles: ["GUIDE"],
    },

    {
      href: "/dashboard/admin",
      label: "Admin Home",
      icon: LayoutDashboard,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/users",
      label: "Manage Users",
      icon: Users,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/listings",
      label: "Manage Listings",
      icon: ListChecks,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/bookings",
      label: "Manage Bookings",
      icon: CalendarCheck,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      href: "/dashboard/admin/payments",
      label: "Payments",
      icon: ShoppingCart,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
  ];

  const visibleLinks = links.filter(
    (l) => !user || (user.role ? l.roles.includes(user.role) : false)
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='grid grid-cols-1 lg:grid-cols-[260px_1fr]'>
        {/* Sidebar */}
        <aside className='border-r bg-white p-4'>
          <Link href='/' className='flex items-center gap-2 mb-6'>
            <MapPin className='h-6 w-6 text-primary' />
            <span className='text-lg font-bold'>Tourify</span>
          </Link>

          {user && (
            <div className='flex items-center gap-3 mb-6'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs text-gray-500'>
                  {user.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          <nav className='space-y-1'>
            {visibleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                <item.icon className='h-4 w-4' />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='mt-6'>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/explore'>
                <Globe className='mr-2 h-4 w-4' />
                Explore
              </Link>
            </Button>
            <div className='mt-3'>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
      <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
    </svg>
  );
}
