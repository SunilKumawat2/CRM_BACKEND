const mongoose = require("mongoose");

const guestRequestSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    roomNumber: { type: String, required: true },

    requestType: {
      type: String,
      enum: ["room_service", "maintenance", "housekeeping", "other"],
      required: true,
    },

    title: { type: String, required: true }, // Short summary
    description: { type: String, default: "" },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminLogin",
      default: null,
    },

    completedAt: { type: Date },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

guestRequestSchema.index({ status: 1, requestType: 1 });

module.exports = mongoose.model("GuestRequest", guestRequestSchema);
