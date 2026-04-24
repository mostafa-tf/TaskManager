const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 15,
      trim: true,
    },
    description: {
      type: String,
      minlength: 0,
      maxlength: 80,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isDone: {
      type: Boolean,
      default: false,
    },

    // personal task owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    starthour: {
      type: String,
      default: "00:00",
    },
    endhour: {
      type: String,
      default: "23:59",
    },

    // NEW FIELDS
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    taskType: {
      type: String,
      enum: ["personal", "project"],
      default: "personal",
    },
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
