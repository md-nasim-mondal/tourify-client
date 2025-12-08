import { Metadata } from "next";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/modules/layout/DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Dashboard - Tourify",
  description: "Your Tourify Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <DashboardLayoutClient userInfo={userInfo}>
      {children}
    </DashboardLayoutClient>
  );
}