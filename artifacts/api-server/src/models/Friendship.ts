import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, enum: ["pending", "accepted", "rejected", "blocked"], default: "pending" },
    friendshipdate: { type: Date, default: null },
  },
  { timestamps: true },
);

friendshipSchema.index({ requester: 1, receiver: 1 }, { unique: true });

export const Friendship = mongoose.model("Friendship", friendshipSchema);
