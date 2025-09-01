"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import EventForm from "@/components/admin/EventForm";
import EventSkeleton from "@/components/ui/EventSkeleton";

export default function NewEventPage() {
  const isLoading = false; // no async fetch here, just showing skeleton until form mounts

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="p-6">
          <EventSkeleton />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <EventForm />
      </div>
    </ProtectedRoute>
  );
}
