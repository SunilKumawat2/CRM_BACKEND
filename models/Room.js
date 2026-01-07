const mongoose = require("mongoose");

const seasonalRateSchema = new mongoose.Schema({
  seasonName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
});

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },

    roomType: {
      type: String,
      enum: ["Standard", "Deluxe", "Suite"],
      required: true,
    },

    baseRate: { type: Number, required: true },

    seasonalRates: [seasonalRateSchema],

    isAvailable: { type: Boolean, default: true },

    // ✅ Updated ENUM → Added "In Maintenance"
    housekeepingStatus: {
      type: String,
      enum: ["Clean", "Dirty", "Under Maintenance", "In Maintenance"],
      default: "Clean",
    },

    amenities: [{ type: String }],

    description: { type: String, default: "" },

    images: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
