"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Event } from "@/types/event";

// ✅ Schema with Zod
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().nonempty("Date is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price must be at least 1"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  isEdit?: boolean;
}

export default function EventForm({ event, isEdit }: EventFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event ? new Date(event.date).toISOString().slice(0, 16) : "",
      price: event?.price || 0,
    },
  });

  // ✅ Ensure default values update on edit
  if (event) {
    setValue("title", event.title);
    setValue("description", event.description);
    setValue("date", new Date(event.date).toISOString().slice(0, 16));
    setValue("price", event.price);
  }

  // ✅ Submit handler
  const onSubmit = async (data: EventFormData) => {
    try {
      if (isEdit && event) {
        await api.put(`/events/${event._id}`, data);
        toast.success("✅ Event updated");
      } else {
        await api.post("/events", data);
        toast.success("✅ Event created");
      }
      router.push("/admin");
    } catch {
      toast.error("❌ Failed to save event");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 bg-white rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold mb-2">
        {isEdit ? "✏️ Edit Event" : "➕ Create Event"}
      </h1>

      {/* Title */}
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full border rounded px-3 py-2"
          placeholder="Event title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Event description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block font-medium mb-1">Date</label>
        <input
          type="datetime-local"
          {...register("date")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium mb-1">Price (₹)</label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : isEdit
          ? "Update Event"
          : "Create Event"}
      </button>
    </form>
  );
}
