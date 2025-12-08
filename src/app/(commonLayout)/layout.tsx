import Footer from "@/components/modules/layout/Footer";
import Navbar from "@/components/modules/layout/Navbar";
import React from "react";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}