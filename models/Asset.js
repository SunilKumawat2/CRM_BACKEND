const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["beds","linens","towels","toiletries","electronics","furniture","other"], default: "other" },
    quantity: { type: Number, default: 0 },
    minQuantityAlert: { type: Number, default: 5 },
    location: { type: String, default: "store" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
