const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true, // feedback is tied to a booking
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    staffRatings: [
      {
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, default: "" },
      }
    ],

    roomRating: { type: Number, min: 1, max: 5, required: true },
    roomComment: { type: String, default: "" },

    serviceRating: { type: Number, min: 1, max: 5 },
    serviceComment: { type: String, default: "" },

    overallRating: { type: Number, min: 1, max: 5 }, // optional calculated

    createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin", default: null },

    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

feedbackSchema.index({ booking: 1, guest: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
