"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", password: "" },
  });

  // ✅ Fetch profile
  useEffect(() => {
    api
      .get<UserProfile>("/users/me")
      .then((res) => {
        setProfile(res.data);
        setValue("name", res.data.name);
      })
      .catch(() => toast.error("❌ Failed to load profile"))
      .finally(() => setLoading(false));
  }, [setValue]);

  // ✅ Submit handler
  const onSubmit = async (data: ProfileFormData) => {
    try {
      const res = await api.put("/users/me", {
        name: data.name,
        password: data.password || undefined,
      });
      setProfile(res.data.user);
      toast.success(res.data.message);
    } catch {
      toast.error("❌ Failed to update profile");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6 text-red-500">Profile not found ❌</p>;

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-4 rounded shadow"
        >
          {/* Email (read-only) */}
            <div>
            <label htmlFor="email" className="block font-medium mb-1">
                Email
            </label>
            <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
            </div>


          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">Change Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter new password"
              className="w-full border rounded px-3 py-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p>Role: {profile.role}</p>
          <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
