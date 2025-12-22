import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/context/i18n";
import LoginSuccessToast from "@/components/modules/auth/LoginSuccessToast";
import LogoutSuccessToast from "@/components/modules/auth/LogoutSuccessToast";
import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Local Guide Platform",
  description:
    "Connects travelers with passionate local experts for authentic, personalized experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider>
          <UserProvider>
            <CartProvider>
              {children}
              <Toaster richColors position='top-right' />
              <Suspense fallback={null}>
                <LoginSuccessToast />
              </Suspense>
              <Suspense fallback={null}>
                <LogoutSuccessToast />
              </Suspense>
            </CartProvider>
          </UserProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
