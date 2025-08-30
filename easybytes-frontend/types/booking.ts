// easybytes-frontend/types/booking.ts
import { Event } from "./event";

export interface Booking {
  _id: string;
  user: Pick<User, "_id" | "name" | "email">; // ✅ reuse User type if you add one
  event: Event;
  createdAt: string;
}

// (Optional) If we add a User type for reuse
export interface User {
  _id: string;
  name: string;
  email: string;
}
