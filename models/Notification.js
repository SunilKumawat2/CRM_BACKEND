const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
      phone: { type: String },
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
