import ProtectedRoute from "@/components/ProtectedRoute";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <EventForm />
      </div>
    </ProtectedRoute>
  );
}
