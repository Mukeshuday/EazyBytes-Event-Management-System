"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    api.get<Booking[]>("/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings ❌", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      setCancelling(bookingId);
      const res = await api.delete(`/bookings/${bookingId}`);
      alert(res.data.message);

      // update UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert("❌ Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading bookings...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You don’t have any bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{booking.event.title}</h2>
              <p>{booking.event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(booking.event.date).toLocaleString()}
              </p>
              <p className="font-bold mt-1">₹ {booking.event.price}</p>

              <button
                onClick={() => handleCancel(booking._id)}
                disabled={cancelling === booking._id}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling === booking._id ? "Cancelling..." : "Cancel Booking"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
