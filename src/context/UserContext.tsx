"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { toast } from "sonner";
import { logoutUser } from "@/services/auth/logoutUser";
import { useRouter, usePathname } from "next/navigation";

interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  role: string;
  photo?: string;
  iat?: number;
  exp?: number;
}

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  setUser: (user: UserInfo | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    const handleGlobalClick = () => {
      fetchUser();
    };
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login"); // Optional: redirect to login or home
      router.refresh(); // Refresh to clear server components if any
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const refreshUser = async () => {
      await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
