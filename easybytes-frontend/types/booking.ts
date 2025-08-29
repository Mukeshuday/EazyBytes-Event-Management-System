// easybytes-frontend/types/booking.ts
import { Event } from "./event";

export interface Booking {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  event: Event;
  createdAt: string;
}
