"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface UserPayload {
  id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
}

function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    // base64url -> base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      if (token) {
        setIsAuth(true);
        const payload = decodeJwt<UserPayload>(token);
        setUserRole(payload?.role ?? null);
      } else {
        setIsAuth(false);
        setUserRole(null);
      }
    };

    checkAuth();

    // sync auth across tabs via localStorage events
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token"); // triggers storage event for other tabs
    router.push("/auth/login");
  };

  const isActive = (path: string | string[]) => {
    const paths = Array.isArray(path) ? path : [path];
    return paths.includes(pathname);
  };

  const linkClass = (path: string | string[]) =>
    isActive(path)
      ? "text-yellow-400 font-semibold border-b-2 border-yellow-400 pb-1 transition"
      : "hover:text-gray-300 transition";

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link
        href="/"
        className={`text-xl font-bold ${pathname === "/" ? "text-yellow-400" : ""}`}
      >
        EazyBytes 🎟️
      </Link>

      {/* Links */}
      <div className="space-x-6 flex items-center">
        <Link href="/events" className={linkClass("/events")}>
          Events
        </Link>

        {isAuth && (
          <>
            <Link href="/bookings" className={linkClass("/bookings")}>
              My Bookings
            </Link>

            {/* Account alias -> profile for now */}
            <Link href="/profile" className={linkClass(["/profile", "/account"])}>
              Account
            </Link>

            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </>
        )}

        {/* Admin-only */}
        {isAuth && userRole === "admin" && (
          <>
            <Link href="/admin" className={linkClass("/admin")}>
              Admin Dashboard
            </Link>
            <Link href="/users" className={linkClass("/users")}>
              Manage Users
            </Link>
          </>
        )}

        {!isAuth ? (
          <>
            <Link href="/auth/login" className={linkClass("/auth/login")}>
              Login
            </Link>
            <Link href="/auth/signup" className={linkClass("/auth/signup")}>
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
