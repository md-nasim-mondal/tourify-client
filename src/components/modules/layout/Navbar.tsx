/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";
import { getUserInfo } from "@/services/auth/getUserInfo";
import LogoutButton from "../auth/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    async function fetchUserInfo() {
      const info = await getUserInfo();
      setUserInfo(info);
    }
    fetchUserInfo();
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/explore", label: t("nav_explore") },
  ];

  const userMenu = userInfo
    ? [
        ...(userInfo.role === "TOURIST"
          ? [
              {
                href: "/dashboard/tourist/bookings",
                label: "My Bookings",
                icon: User,
              },
            ]
          : []),
        ...(userInfo.role === "GUIDE"
          ? [
              { href: "/dashboard/guide", label: "Dashboard", icon: User },
              { href: "/dashboard/guide/listings", label: "My Listings" },
              { href: "/dashboard/guide/bookings", label: "My Bookings" },
            ]
          : []),
        ...(userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN"
          ? [
              {
                href: "/dashboard/admin",
                label: "Admin Dashboard",
                icon: User,
              },
              { href: "/dashboard/admin/users", label: "Manage Users" },
              { href: "/dashboard/admin/listings", label: "Manage Listings" },
              { href: "/dashboard/admin/bookings", label: "Manage Bookings" },
            ]
          : []),
        { href: "dashboard/profile/me", label: "Profile", icon: Settings },
      ]
    : [];

  return (
    <nav className='sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <MapPin className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold'>Tourify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-6 md:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-gray-600"
                }`}>
                {link.label}
              </Link>
            ))}
            {!userInfo && (
              <>
                <Link
                  href='/register'
                  className='text-sm font-medium text-gray-600 hover:text-primary'>
                  {t("nav_become_guide")}
                </Link>
                <div className='flex items-center gap-2'>
                  <Button asChild variant='ghost'>
                    <Link href='/login'>{t("login")}</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/register'>{t("register")}</Link>
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setLang(lang === "en" ? "bn" : "en")}>
                    {" "}
                    {lang.toUpperCase()}{" "}
                  </Button>
                </div>
              </>
            )}
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={userInfo.photo} alt={userInfo.name} />
                      <AvatarFallback>
                        {userInfo.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium'>{userInfo.name}</p>
                      <p className='text-xs text-gray-500'>{userInfo.email}</p>
                      <span className='text-xs text-primary'>
                        {userInfo.role.replace("_", " ")}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenu.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className='cursor-pointer'>
                        {item.icon && <item.icon className='mr-2 h-4 w-4' />}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div className='cursor-pointer'>
                      <LogOut className='mr-2 h-4 w-4' />
                      <LogoutButton />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='space-y-1 border-t py-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='block py-2 text-sm font-medium text-gray-600 hover:text-primary'
                  onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {!userInfo && (
                <>
                  <Link
                    href='/register'
                    className='block py-2 text-sm font-medium text-gray-600 hover:text-primary'
                    onClick={() => setIsMenuOpen(false)}>
                    Become a Guide
                  </Link>
                  <div className='flex flex-col gap-2 pt-2'>
                    <Button asChild variant='outline' className='w-full'>
                      <Link href='/login' onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className='w-full'>
                      <Link
                        href='/register'
                        onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </>
              )}
              {userInfo && (
                <div className='space-y-2 pt-2'>
                  <div className='flex items-center gap-3 p-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={userInfo.photo} alt={userInfo.name} />
                      <AvatarFallback>
                        {userInfo.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>{userInfo.name}</p>
                      <p className='text-xs text-gray-500'>{userInfo.email}</p>
                    </div>
                  </div>
                  {userMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className='block py-2 text-sm font-medium text-gray-600 hover:text-primary'
                      onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                  <div className='pt-2'>
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
