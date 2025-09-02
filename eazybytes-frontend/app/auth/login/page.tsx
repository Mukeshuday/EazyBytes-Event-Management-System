"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/errorHandler";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", data);

      Cookies.set("token", res.data.token, { expires: 1 });
      toast.success("✅ Login successful!");
      router.push("/events");
    } catch (err: unknown) {
      toast.error("❌ Login failed: " + handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full border p-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
