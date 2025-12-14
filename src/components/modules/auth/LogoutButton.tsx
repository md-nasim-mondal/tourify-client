"use client";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/logoutUser";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    // Force hard refresh to ensure Navbar state (which is in Layout) is cleared
    // router.refresh() might not reset client-side state of persistent components
    window.location.href = "/login";
  };

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
