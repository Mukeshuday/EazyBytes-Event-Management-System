import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
