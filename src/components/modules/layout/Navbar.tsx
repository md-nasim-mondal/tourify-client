/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, User, Settings, LogOut, ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";
import { useUser } from "@/context/UserContext";
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
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false); // For Mobile
  const { user: userInfo } = useUser();
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();

  const navLinks = [
    { href: "/", label: t("nav_home") },
    {
      label: "All Tours",
      href: "/explore",
      type: "",
      // type: "mega",
      children: [
        { label: "Popular Cities", items: [
            { name: "Kyoto", href: "/explore?searchTerm=Kyoto" },
            { name: "Paris", href: "/explore?searchTerm=Paris" },
            { name: "New York", href: "/explore?searchTerm=New York" },
            { name: "Bali", href: "/explore?searchTerm=Bali" },
        ]},
        { label: "Regions", items: [
            { name: "Asia", href: "/explore?searchTerm=Asia" },
            { name: "Europe", href: "/explore?searchTerm=Europe" },
            { name: "North America", href: "/explore?searchTerm=North America" },
            { name: "Africa", href: "/explore?searchTerm=Africa" },
        ]},
      ]
    },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
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
    <nav className='sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-md dark:bg-black/80'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 transition-transform hover:scale-105'>
            <MapPin className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
              Tourify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            {navLinks.map((link) => (
              link.type === 'mega' ? (
                <div key={link.label} className="group relative">
                   <Link
                      href={link.href}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                        pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                      }`}>
                      {link.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                   </Link>
                   {/* Mega Menu Dropdown */}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out w-[500px]">
                      <div className="grid grid-cols-2 gap-6 rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 dark:bg-slate-950 dark:ring-gray-800">
                        {link.children.map((section) => (
                          <div key={section.label}>
                            <h4 className="font-semibold text-foreground mb-3">{section.label}</h4>
                            <ul className="space-y-2">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  <Link href={item.href} className="block text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-2 py-1 transition-colors">
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}>
                  {link.label}
                </Link>
              )
            ))}

            <div className="flex items-center gap-4">
               {/* Cart/Booking Placeholder - visible to all or just logged in? Visible to all usually */}
                {userInfo && (
                   <Link href="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
                      <ShoppingCart className="h-5 w-5" />
                   </Link>
                )}

              {!userInfo && (
                <>
                  <div className="h-4 w-px bg-border/50 hidden lg:block"></div>
                  <Link
                    href='/register'
                    className='hidden lg:block text-sm font-medium text-muted-foreground hover:text-primary'>
                    {t("nav_become_guide")}
                  </Link>
                  <Button asChild variant='ghost' size="sm">
                    <Link href='/login'>{t("login")}</Link>
                  </Button>
                </>
              )}
              {userInfo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/10">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={userInfo.photo} alt={userInfo.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {userInfo.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className="w-56">
                    <DropdownMenuLabel>
                      <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium'>{userInfo.name}</p>
                        <p className='text-xs text-muted-foreground truncate'>{userInfo.email}</p>
                        <span className='inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 w-fit'>
                          {userInfo.role.replace("_", " ")}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenu.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className='cursor-pointer flex items-center gap-2'>
                          {item.icon && <item.icon className='h-4 w-4' />}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <div className='cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20'>
                        <LogOut className='mr-2 h-4 w-4' />
                        <LogoutButton />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
               <Button
                  variant='ghost'
                  size="icon"
                  className="h-9 w-9 text-muted-foreground"
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}>
                  <span className="text-xs font-bold">{lang.toUpperCase()}</span>
               </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 text-muted-foreground hover:text-primary'
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
          <div className='md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border shadow-lg animate-in slide-in-from-top-5'>
            <div className='container mx-auto px-4 py-4 space-y-4 h-[calc(100vh-64px)] overflow-auto'>
              {navLinks.map((link) => (
                link.type === 'mega' ? (
                   <div key={link.label} className="space-y-2">
                      <button 
                        onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                        className="flex w-full items-center justify-between text-base font-medium text-muted-foreground hover:text-primary py-2"
                      >
                         {link.label}
                         <ChevronDown className={`h-4 w-4 transition-transform ${isDestinationsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDestinationsOpen && (
                        <div className="pl-4 space-y-4 border-l-2 border-border/50 ml-1">
                           {link.children.map(section => (
                              <div key={section.label}>
                                 <h5 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">{section.label}</h5>
                                 <div className="grid grid-cols-2 gap-2">
                                    {section.items.map(item => (
                                       <Link 
                                          key={item.name} 
                                          href={item.href}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="text-sm text-muted-foreground hover:text-primary py-1"
                                       >
                                          {item.name}
                                       </Link>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                      )}
                   </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='block py-2 text-base font-medium text-muted-foreground hover:text-primary'
                    onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </Link>
                )
              ))}
              
              <div className="border-t border-border pt-4 mt-4 space-y-4">
                 {!userInfo ? (
                    <div className="space-y-3">
                       <Link href="/register" className="block text-sm font-medium text-muted-foreground">
                          {t("nav_become_guide")}
                       </Link>
                       <div className="">
                          <Button asChild variant="outline" className="w-full">
                             <Link href="/login">Login</Link>
                          </Button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <Avatar>
                             <AvatarImage src={userInfo.photo} />
                             <AvatarFallback>{userInfo.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                             <p className="font-medium">{userInfo.name}</p>
                             <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                          </div>
                       </div>
                       {userMenu.map(item => (
                          <Link 
                             key={item.href}
                             href={item.href}
                             className="flex items-center gap-3 py-2 text-muted-foreground hover:text-primary"
                             onClick={() => setIsMenuOpen(false)}
                          >
                             {item.icon && <item.icon className="h-4 w-4" />}
                             {item.label}
                          </Link>
                       ))}
                       <div className="pt-2">
                          <LogoutButton />
                       </div>
                    </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
