"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import EventDetailSkeleton from "@/components/ui/EventDetailSkeleton";

function EventDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // ✅ Fetch event details
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get<Event>(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => toast.error("❌ Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Handle booking
  const handleBookNow = async () => {
    try {
      setBooking(true);
      await api.post(`/bookings/${id}`);
      toast.success("🎉 Booking successful!");
      // optional redirect
      setTimeout(() => router.push("/bookings"), 800);
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      const message = axiosErr.response?.data?.message || "❌ Booking failed";
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }
  if (!event) {
    return <p className="p-6 text-gray-600">Event not found.</p>;
  }

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-700">{event.description}</p>

          <div className="text-sm text-gray-500">
            <div>Date: {new Date(event.date).toLocaleString()}</div>
            <div className="mt-1 font-semibold text-gray-800">
              ₹ {event.price}
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleBookNow}
              disabled={booking}
              className="w-full sm:w-auto"
            >
              {booking ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ Wrap in ProtectedRoute (only logged-in users can book)
export default function EventDetailPage() {
  return (
    <ProtectedRoute>
      <EventDetailContent />
    </ProtectedRoute>
  );
}
