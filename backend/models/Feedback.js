const mongoose = require("mongoose");

const Feedbackschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    message: {
      type: String,
      min: 4,
      max: 80,
      required: true,
    },
  },
  { timestamps: true },
);

const Feedback = mongoose.model("Feedback", Feedbackschema);
module.exports = Feedback;
