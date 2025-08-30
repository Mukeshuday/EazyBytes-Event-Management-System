"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventForm from "@/components/admin/EventForm";
import api from "@/lib/api";
import { Event } from "@/types/event";
import toast from "react-hot-toast";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get<Event>(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => toast.error("❌ Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6 text-red-500">Event not found ❌</p>;

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <EventForm event={event} isEdit />
      </div>
    </ProtectedRoute>
  );
}
