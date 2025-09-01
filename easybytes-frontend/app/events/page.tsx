"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Event } from "@/types/event";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import EventSkeleton from "@/components/ui/EventSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";

 function EventsPageContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [bookedEvents, setBookedEvents] = useState<Set<string>>(new Set()); 

  // ✅ Fetch events
  useEffect(() => {
    api
      .get<Event[]>("/events")
      .then((res) => setEvents(res.data))
      .catch((err: AxiosError) => {
        console.error("Failed to fetch events ❌", err);
        toast.error("❌ Failed to fetch events");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Handle booking
  const handleBooking = async (eventId: string) => {
    try {
      setBooking(eventId);
      const res = await api.post(`/bookings/${eventId}`);
      toast.success(res.data.message || "✅ Booking successful!");
      setBookedEvents(prev => new Set(prev).add(eventId));
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || "❌ Booking failed");
    } finally {
      setBooking(null);
    }
  };

  // ✅ Loading shimmer
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">🎉 Events</h1>
        {[...Array(3)].map((_, i) => (
          <EventSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Events</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">No events available yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="font-bold mt-1">₹ {event.price}</p>

            <button
              onClick={() => handleBooking(event._id)}
              disabled={booking === event._id || bookedEvents.has(event._id)}
              className={`mt-2 px-4 py-2 rounded text-white ${
                bookedEvents.has(event._id)
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {bookedEvents.has(event._id)
                ? "Booked ✅"
                : booking === event._id
                ? "Booking..."
                : "Book Now"}
            </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsPageContent />
    </ProtectedRoute>
  );
}