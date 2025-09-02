"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // ✅ Fetch all users (admin only)
  useEffect(() => {
    api
      .get<User[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("❌ Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Change role
  const handleRoleChange = async (id: string, role: "user" | "admin") => {
    try {
      setUpdating(id);
      const res = await api.patch(`/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: res.data.user.role } : u))
      );
      toast.success("✅ Role updated");
    } catch {
      toast.error("❌ Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setUpdating(id);
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("✅ User deleted");
    } catch {
      toast.error("❌ Failed to delete user");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Manage Users</h1>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full border rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <select
                      aria-label="User Role"  
                      value={user.role}
                      disabled={updating === user._id}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value as "user" | "admin")
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={updating === user._id}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}
