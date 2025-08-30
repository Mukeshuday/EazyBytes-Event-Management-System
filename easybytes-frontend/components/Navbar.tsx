"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!Cookies.get("token"));
    checkAuth();

    // ✅ Sync auth state across tabs
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token"); // ✅ triggers storage event
    console.log("✅ Logged out");
    router.push("/auth/login");
  };


  // ✅ Utility function for active link style
  const linkClasses = (path: string) =>
    pathname === path
      ? "text-yellow-400 font-semibold border-b-2 border-yellow-400 pb-1 transition"
      : "hover:text-gray-300 transition";

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link
        href="/"
        className={`text-xl font-bold ${pathname === "/" ? "text-yellow-400" : ""}`}
      >
        EasyBytes 🎟️
      </Link>

      {/* Links */}
      <div className="space-x-6 flex items-center">
        <Link href="/events" className={linkClasses("/events")}>
          Events
        </Link>
        <Link href="/bookings" className={linkClasses("/bookings")}>
          My Bookings
        </Link>

        {!isAuth ? (
          <>
            <Link href="/auth/login" className={linkClasses("/auth/login")}>
              Login
            </Link>
            <Link href="/auth/signup" className={linkClasses("/auth/signup")}>
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
