const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    otp: { type: String, default: null },       // For EMAIL OTP
    otpExpiry: { type: Date, default: null },   // For EMAIL OTP

    profileImage: { type: String, default: "" },

    isVerified: { type: Boolean, default: false },

    extraFields: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
