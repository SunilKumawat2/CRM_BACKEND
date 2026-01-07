const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin", required: true },
    issue: { type: String, required: true }, // e.g., "AC not working"
    category: { type: String, enum: ["AC", "TV", "Plumbing", "Electrical", "Furniture", "Other"], default: "Other" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

    // <-- Change Staff reference to AdminLogin
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin", default: null },

    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    resolvedAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
