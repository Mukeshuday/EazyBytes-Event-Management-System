"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventSkeleton from "@/components/ui/EventSkeleton";

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch events
  useEffect(() => {
    api
      .get<Event[]>("/events")
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("❌ Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Delete Event
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("✅ Event deleted");
    } catch (err) {
      toast.error("❌ Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1>
        {[...Array(3)].map((_, i) => (
          <EventSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">⚙️ Admin Dashboard</h1>

        <button
          onClick={() => router.push("/admin/events/new")}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Create Event
        </button>

        {events.length === 0 ? (
          <p className="text-gray-500">No events created yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="font-semibold text-lg">{event.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="font-bold">₹ {event.price}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/admin/events/${event._id}/edit`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
