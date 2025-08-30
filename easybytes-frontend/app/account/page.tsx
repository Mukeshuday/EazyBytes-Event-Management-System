"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

interface User {
  name: string;
  email: string;
  createdAt?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    api
      .get<User>("/users/me")   // 🔥 updated endpoint
      .then((res) => setUser(res.data))
      .catch((err: AxiosError) => {
        console.error("Failed to load account ❌", err);
        toast.error("❌ Failed to load account info");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("✅ Logged out");
    router.push("/auth/login");
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading account...</p>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">You are not logged in.</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">👤 My Account</h1>

      <div className="space-y-3">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        {user.createdAt && (
          <p className="text-sm text-gray-500">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
