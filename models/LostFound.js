const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    foundIn: { type: String, enum: ["room", "public_area"], default: "room" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    description: { type: String, default: "" },
    foundBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin", required: true },
    status: { type: String, enum: ["found", "claimed", "unclaimed"], default: "found" },
    claimedByGuest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest" },
    claimNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostFound", lostFoundSchema);
