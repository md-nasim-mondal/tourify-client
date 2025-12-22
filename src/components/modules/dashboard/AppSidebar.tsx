
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MapPin,
    LayoutDashboard,
    ListChecks,
    CalendarCheck, Users,
    Globe,
    Star, Menu, CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "@/components/modules/auth/LogoutButton";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const [user, setUser] = useState<{
    name?: string;
    photo?: string;
    role?: string;
    email?: string;
  } | null>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
         const info = await getUserInfo();
         setUser(info);
      } finally {
         setLoading(false);
      }
    })();
  }, []);

  const links = [
    {
      href: "/dashboard/tourist",
      label: "Dashboard",
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
      href: "/dashboard/tourist/payments",
      label: "Payment History",
      icon: CreditCard,
      roles: ["TOURIST"],
    },
    {
      href: "/dashboard/tourist/reviews",
      label: "My Reviews",
      icon: Star,
      roles: ["TOURIST"],
    },
    {
      href: "/dashboard/guide",
      label: "Dashboard",
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
      icon: CalendarCheck,
      roles: ["GUIDE"],
    },
    {
      href: "/dashboard/guide/payouts",
      label: "Payouts",
      icon: CreditCard,
      roles: ["GUIDE"],
    },
    {
      href: "/dashboard/admin",
      label: "Dashboard",
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
      icon: CreditCard,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    // Common
    {
        href: "/dashboard/profile/me",
        label: "My Profile",
        icon: Users,
        roles: ["TOURIST", "GUIDE", "ADMIN", "SUPER_ADMIN"],
    }
  ];

  if (loading) {
     return <div className="h-full w-full bg-background border-r animate-pulse" />;
  }

  const visibleLinks = links.filter(
    (l) => user && user.role && l.roles.includes(user.role)
  );

  const SidebarContent = () => (
    <div className='flex h-full flex-col gap-4 h-screen overflow-y-auto sticky top-0'>
      <div className='flex h-14 items-center border-b px-6'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          <MapPin className='h-6 w-6 text-primary' />
          <span>Tourify</span>
        </Link>
      </div>
      
      {user && (
        <div className='px-6 py-2'>
           <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 border">
             <Avatar className='h-10 w-10 border transition-transform hover:scale-105'>
                 <AvatarImage src={user.photo} alt={user.name} />
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   {user.name?.charAt(0).toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="overflow-hidden">
                 <p className='truncate text-sm font-medium'>{user.name}</p>
                 <p className='truncate text-xs text-zinc-500 capitalize'>
                   {user.role?.toLowerCase().replace("_", " ")}
                 </p>
               </div>
           </div>
        </div>
      )}

      <div className='flex-1 overflow-auto py-2'>
        <nav className='grid items-start px-4 text-sm font-medium'>
          {visibleLinks.map((item) => {
             const isActive = pathname === item.href;
             return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-zinc-500"
                  )}>
                  <item.icon className='h-4 w-4' />
                  {item.label}
                </Link>
             )
          })}
        </nav>
      </div>

      <div className='border-t p-4'>
         <Button asChild variant="ghost" className="w-full justify-start text-zinc-500 hover:text-primary">
            <Link href="/explore">
               <Globe className="mr-2 h-4 w-4" />
               Explore Page
            </Link>
         </Button>
         <div className="mt-2">
            <LogoutButton />
         </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className='hidden border-r bg-white md:block md:w-[280px]'>
        <SidebarContent />
      </aside>
    </>
  );
}
