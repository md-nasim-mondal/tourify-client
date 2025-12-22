"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const LogoutButton = () => {
  const { logout } = useUser();

  return (
    <Button variant={"destructive"} onClick={() => logout()}>
      Logout
    </Button>
  );
};

export default LogoutButton;
