"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchIcon, MapPin, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from localStorage or cookies
    const token =
      localStorage.getItem("accessToken") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    if (token) {
      try {
        // Parse JWT token (simplified - in production use proper JWT decoding)
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Batch state updates to avoid cascading renders
        Promise.resolve().then(() => {
          setRole(payload.role || null);
          setUserName(payload.name || payload.email?.split("@")[0] || null);
          setIsLoggedIn(true);
        });
      } catch {
        Promise.resolve().then(() => setIsLoggedIn(false));
      }
    } else {
      Promise.resolve().then(() => setIsLoggedIn(false));
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Reset state
    setIsLoggedIn(false);
    setRole(null);
    setUserName(null);

    // Redirect to home
    router.push("/");
    router.refresh();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary'>
              <MapPin className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-bold tracking-tight text-gray-900'>
              <span className='text-primary'>Tour</span>ify
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className='hidden md:flex items-center gap-6'>
            <Link
              href='/tours'
              className='text-sm font-medium text-gray-700 hover:text-primary transition-colors'>
              Explore Tours
            </Link>
            <Link
              href='/guides'
              className='text-sm font-medium text-gray-700 hover:text-primary transition-colors'>
              Find Guides
            </Link>
            <Link
              href='/destinations'
              className='text-sm font-medium text-gray-700 hover:text-primary transition-colors'>
              Destinations
            </Link>
            {!isLoggedIn && (
              <Link
                href='/become-guide'
                className='text-sm font-medium text-gray-700 hover:text-primary transition-colors'>
                Become a Guide
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center gap-3'>
            {/* Search Button */}
            <Button
              variant='ghost'
              size='icon'
              asChild
              className='hidden sm:flex'>
              <Link href='/tours'>
                <SearchIcon className='h-5 w-5' />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleMenu}
              className='md:hidden'>
              {isMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>

            {/* Auth/User Section (Desktop) */}
            {!isLoggedIn ? (
              <div className='hidden md:flex items-center gap-2'>
                <Button variant='ghost' asChild>
                  <Link href='/login'>Login</Link>
                </Button>
                <Button asChild>
                  <Link href='/register'>Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className='hidden md:flex items-center gap-3'>
                {/* Role-Based Links */}
                {role === "TOURIST" && (
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/dashboard/tourist'>My Bookings</Link>
                  </Button>
                )}
                {role === "GUIDE" && (
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/dashboard/guide'>Dashboard</Link>
                  </Button>
                )}
                {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/dashboard/admin'>Admin Panel</Link>
                  </Button>
                )}

                {/* User Profile Dropdown */}
                <div className='relative group'>
                  <Button variant='ghost' size='icon' className='rounded-full'>
                    <User className='h-5 w-5' />
                  </Button>
                  <div className='absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                    <Link
                      href='/profile/me'
                      className='flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100'>
                      <User className='h-4 w-4' />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50'>
                      <LogOut className='h-4 w-4' />
                      Logout
                    </button>
                  </div>
                </div>

                {/* User Name */}
                {userName && (
                  <span className='text-sm font-medium text-gray-700'>
                    Hi, {userName}!
                  </span>
                )}
              </div>
            )}

            {/* Mobile Auth Buttons (When not logged in) */}
            {!isLoggedIn && (
              <div className='flex md:hidden items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href='/login'>Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden border-t py-4'>
            <div className='flex flex-col gap-4'>
              <Link
                href='/tours'
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                onClick={() => setIsMenuOpen(false)}>
                Explore Tours
              </Link>
              <Link
                href='/guides'
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                onClick={() => setIsMenuOpen(false)}>
                Find Guides
              </Link>
              <Link
                href='/destinations'
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                onClick={() => setIsMenuOpen(false)}>
                Destinations
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link
                    href='/become-guide'
                    className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                    onClick={() => setIsMenuOpen(false)}>
                    Become a Guide
                  </Link>
                  <Link
                    href='/register'
                    className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                    onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {role === "TOURIST" && (
                    <Link
                      href='/dashboard/tourist'
                      className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                      onClick={() => setIsMenuOpen(false)}>
                      My Bookings
                    </Link>
                  )}
                  {role === "GUIDE" && (
                    <Link
                      href='/dashboard/guide'
                      className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                      onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <Link
                      href='/dashboard/admin'
                      className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                      onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href='/profile/me'
                    className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg'
                    onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className='px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left'>
                    Logout
                  </button>
                </>
              )}

              {/* User Info in Mobile Menu */}
              {isLoggedIn && userName && (
                <div className='px-4 py-2 border-t'>
                  <p className='text-sm text-gray-500'>Logged in as:</p>
                  <p className='font-medium'>{userName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
