import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    message: { type: String, required: true },
    usertype: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export const Log = mongoose.model("Log", logSchema);

export const createLog = async (
  receiver: string,
  message: string,
  usertype: "admin" | "user" = "user",
  sender?: string
) => {
  try {
    await Log.create({ receiver, sender: sender || null, message, usertype });
  } catch (_) {}
};
