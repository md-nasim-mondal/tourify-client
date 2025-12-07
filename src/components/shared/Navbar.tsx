/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

type Decoded = { role?: string } | undefined;

export default function Navbar() {
  const token = Cookies.get("accessToken");
  let initialRole: string | null = null;
  if (token) {
    try {
      const decoded = jwtDecode(token) as Decoded;
      initialRole = decoded?.role ?? null;
    } catch {
      initialRole = null;
    }
  }
  const [role, setRole] = useState<string | null>(initialRole);

  const logout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/";
  };

  return (
    <nav className='w-full border-b bg-white'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        <Link href='/' className='font-bold text-xl'>
          Tourify
        </Link>
        <div className='flex items-center gap-4'>
          <Link href='/tours' className='hover:underline'>
            Explore Tours
          </Link>
          {!role && (
            <>
              <Link href='/register' className='hover:underline'>
                Register
              </Link>
              <Link href='/login' className='hover:underline'>
                Login
              </Link>
            </>
          )}
          {role === "TOURIST" && (
            <>
              <Link href='/dashboard/tourist' className='hover:underline'>
                My Bookings
              </Link>
              <Link href='/profile/me' className='hover:underline'>
                Profile
              </Link>
              <button onClick={logout} className='hover:underline'>
                Logout
              </button>
            </>
          )}
          {role === "GUIDE" && (
            <>
              <Link href='/dashboard/guide' className='hover:underline'>
                Dashboard
              </Link>
              <Link href='/profile/me' className='hover:underline'>
                Profile
              </Link>
              <button onClick={logout} className='hover:underline'>
                Logout
              </button>
            </>
          )}
          {(role === "ADMIN" || role === "SUPER_ADMIN") && (
            <>
              <Link href='/dashboard/admin' className='hover:underline'>
                Admin Dashboard
              </Link>
              <Link href='/profile/me' className='hover:underline'>
                Profile
              </Link>
              <button onClick={logout} className='hover:underline'>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
