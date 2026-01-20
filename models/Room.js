const mongoose = require("mongoose");

/* ================= SEASONAL RATE ================= */
const seasonalRateSchema = new mongoose.Schema(
  {
    seasonName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

/* ================= ROOM SCHEMA ================= */
const roomSchema = new mongoose.Schema(
  {
    /* 🔹 Basic Info */
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    roomType: {
      type: String,
      enum: ["Standard", "Deluxe", "Suite","Executive","Penthouse"],
      required: true,
    },

    roomView: {
      type: String,
      enum: ["City", "Sea", "Garden","Mountain","Pool"],
      default: "City",
    },

    floorLevel: {
      type: String,
      enum: ["Ground", "Middle", "Top"],
      default: "Middle",
    },

    nearElevator: { type: Boolean, default: false },

    /* 🔹 Pricing */
    baseRate: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 }, // flat discount amount

    payAtHotel: { type: Boolean, default: false },
    freeCancellation: { type: Boolean, default: false },
    refundable: { type: Boolean, default: false },

    /* 🔹 Occupancy */
    maxAdults: { type: Number, default: 1 },
    maxChildren: { type: Number, default: 0 },
    maxOccupancy: { type: Number, default: 1 },
    extraBedAllowed: { type: Boolean, default: false },

    /* 🔹 Bed & Room Features */
    bedType: {
      type: String,
      enum: ["Single", "Double", "Queen", "King"],
      default: "Single",
    },

    numberOfBeds: { type: Number, default: 1 },

    hasLivingArea: { type: Boolean, default: false },
    hasBalcony: { type: Boolean, default: false },

    /* 🔹 Bathroom & Utilities */
    bathtub: { type: Boolean, default: false },
    jacuzzi: { type: Boolean, default: false },
    hairDryer: { type: Boolean, default: false },

    /* 🔹 Accessibility */
    wheelchairAccessible: { type: Boolean, default: false },
    groundFloor: { type: Boolean, default: false },
    seniorFriendly: { type: Boolean, default: false },

    /* 🔹 Stay Rules */
    smokingAllowed: { type: Boolean, default: false },
    earlyCheckin: { type: Boolean, default: false },
    lateCheckout: { type: Boolean, default: false },
    hourlyStay: { type: Boolean, default: false },
    longStayFriendly: { type: Boolean, default: false },

    /* 🔹 Status */
    isAvailable: { type: Boolean, default: true },

    housekeepingStatus: {
      type: String,
      enum: ["Clean", "Dirty", "In Maintenance"],
      default: "Clean",
    },

    rating: { type: Number, default: 0 },

    /* 🔹 Arrays */
    amenities: [{ type: String }],
    tags: [{ type: String }],
    images: [{ type: String }],


    /* 🔹 Seasonal Rates */
    seasonalRates: [seasonalRateSchema],

    /* 🔹 Description */
    description: { type: String, default: "" },

    /* 🔹 Meta */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminLogin",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ================= VIRTUALS ================= */

/* ✅ Final price after discount */
roomSchema.virtual("finalPrice").get(function () {
  if (this.discountedPrice > 0) {
    return Math.max(this.baseRate - this.discountedPrice, 0);
  }
  return this.baseRate;
});

/* ================= INDEXES ================= */

/* ✅ Faster filtering by price */
roomSchema.index({ baseRate: 1 });

module.exports = mongoose.model("Room", roomSchema);
