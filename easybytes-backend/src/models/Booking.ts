import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "./Event.js";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId | IEvent;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
