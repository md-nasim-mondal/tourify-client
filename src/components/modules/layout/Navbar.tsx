/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, Home } from "lucide-react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import LogoutButton from "@/components/modules/auth/LogoutButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      setUserInfo(user);
    };
    fetchUser();
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/tours", label: "Tours" },
    { href: "/guides", label: "Guides" },
    { href: "/destinations", label: "Destinations" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>T</span>
            </div>
            <span className='text-xl font-bold text-gray-800'>Tourify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === link.href ? "text-blue-600 font-medium" : ""
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            {userInfo ? (
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                  <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <User size={16} className='text-blue-600' />
                  </div>
                  <span className='text-sm font-medium'>{userInfo.name}</span>
                </div>
                <Link href='/dashboard'>
                  <Button variant='outline' size='sm'>
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Link href='/login'>
                  <Button variant='outline' size='sm'>
                    Sign In
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button size='sm'>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden border-t py-4'>
            <div className='space-y-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 px-4 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}>
                  <div className='flex items-center space-x-2'>
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              ))}

              <div className='pt-4 border-t space-y-3'>
                {userInfo ? (
                  <>
                    <div className='px-4 py-2 bg-gray-50 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <User size={16} className='text-blue-600' />
                        </div>
                        <div>
                          <p className='font-medium'>{userInfo.name}</p>
                          <p className='text-xs text-gray-500'>
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href='/dashboard'
                      className='block py-2 px-4 rounded-lg hover:bg-gray-50'
                      onClick={() => setIsOpen(false)}>
                      <div className='flex items-center space-x-2'>
                        <Settings size={18} />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <div className='px-4'>
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href='/login'
                      className='block py-2 px-4 rounded-lg hover:bg-gray-50'
                      onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                    <Link
                      href='/register'
                      className='block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                      onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
