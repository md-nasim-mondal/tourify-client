"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  MapPin,
  Star,
  Bell,
  Menu,
  X,
  User,
  CreditCard,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/modules/auth/LogoutButton";
import { UserInfo } from "@/types/user.interface";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userInfo: UserInfo;
}

const DashboardLayoutClient = ({ children, userInfo }: DashboardLayoutClientProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getDashboardRoute = () => {
    switch (userInfo.role) {
      case "TOURIST": return "/dashboard/tourist";
      case "GUIDE": return "/dashboard/guide";
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/dashboard/admin";
      default: return "/dashboard";
    }
  };

  const touristNavItems = [
    { href: "/dashboard/tourist", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/tourist/bookings", icon: <Calendar size={20} />, label: "My Bookings" },
    { href: "/dashboard/tourist/reviews", icon: <Star size={20} />, label: "My Reviews" },
    { href: "/dashboard/tourist/wishlist", icon: <MapPin size={20} />, label: "Wishlist" },
  ];

  const guideNavItems = [
    { href: "/dashboard/guide", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/guide/tours", icon: <MapPin size={20} />, label: "My Tours" },
    { href: "/dashboard/guide/bookings", icon: <Calendar size={20} />, label: "Bookings" },
    { href: "/dashboard/guide/reviews", icon: <Star size={20} />, label: "Reviews" },
    { href: "/dashboard/guide/earnings", icon: <CreditCard size={20} />, label: "Earnings" },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/admin/users", icon: <Users size={20} />, label: "Users" },
    { href: "/dashboard/admin/tours", icon: <MapPin size={20} />, label: "Tours" },
    { href: "/dashboard/admin/bookings", icon: <Calendar size={20} />, label: "Bookings" },
    { href: "/dashboard/admin/guides", icon: <Users size={20} />, label: "Guides" },
  ];

  const commonNavItems = [
    { href: "/profile/me", icon: <User size={20} />, label: "Profile" },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings" },
    { href: "/help", icon: <HelpCircle size={20} />, label: "Help" },
  ];

  const getNavItems = () => {
    switch (userInfo.role) {
      case "TOURIST": return touristNavItems;
      case "GUIDE": return guideNavItems;
      case "ADMIN":
      case "SUPER_ADMIN":
        return adminNavItems;
      default: return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center px-6 mb-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold">Tourify</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{userInfo.name}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {userInfo.role.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t">
                {commonNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Logout */}
          <div className="p-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            <Link href="/" className="ml-4 flex items-center space-x-2">
              <div className="h-6 w-6 bg-blue-600 rounded"></div>
              <span className="font-bold">Tourify</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell size={20} />
            </Button>
            <div className="w-8 h-8 rounded-full bg-blue-100"></div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
                    <span className="text-xl font-bold">Tourify</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{userInfo.name}</div>
                      <div className="text-sm text-gray-500">{userInfo.role}</div>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 mx-2 rounded-lg ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t mx-4">
                    {commonNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 mx-2 rounded-lg ${
                          pathname === item.href
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>

              <div className="p-4 border-t">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutClient;