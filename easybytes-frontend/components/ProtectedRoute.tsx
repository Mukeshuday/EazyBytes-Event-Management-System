"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

interface DecodedToken {
  id: string;
  email: string;
  role?: "user" | "admin";
  exp?: number;
  iat?: number;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // ✅ check expiry
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        Cookies.remove("token");
        router.push("/auth/login");
        return;
      }

      // ✅ check role if adminOnly
      if (adminOnly && decoded.role !== "admin") {
        router.push("/");
        return;
      }

      setAuthorized(true);
    } catch {
      router.push("/auth/login");
    }
  }, [adminOnly, router]);

  if (!authorized) {
    return <p className="p-6 text-gray-600">Checking permissions...</p>;
  }

  return <>{children}</>;
}
