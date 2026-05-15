import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["friend request accepted", "assigned task", "assigned project", "task expiration"],
      required: true,
    },
    message: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    projectid: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "Project" },
    sender: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    taskid: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
