const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "general" },
  paidAt: { type: Date, default: Date.now },
  vendor: { type: String, default: "" },
  invoiceDocument: { type: String, default: "" },
  notes: { type: String, default: "" },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }, // <-- link to invoice
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminLogin" }
}, { timestamps: true });


module.exports = mongoose.model("Expense", expenseSchema);
