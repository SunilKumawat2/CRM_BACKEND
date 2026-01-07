const User = require("../models/Users");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const SendOTP = require("../utils/Send_otp");
const VerifyOTP = require("../utils/Otp_Verify");
const firebase_token = require("../config/firebaseAdmin");
const { getIo } = require("../middleware/socket");
const Notification = require("../models/Notification");
// ------------------- Send OTP (Register / Login User) -------------------
const User_sendOtp = async (req, res) => {
    try {
      const { email, phone } = req.body;
      const io = getIo(); // Socket instance
  
      if (!email && !phone) {
        return res.status(400).json({ status: 400, message: "Email or phone required" });
      }
  
      let user = await User.findOne({ $or: [{ email }, { phone }] });
  
      // New user registration
      if (!user) {
        user = await User.create({ email: email || null, phone: phone || null });
  
        const notifData = {
          message: `New user registered: ${email || phone}`,
          type: "user-register",
          user: { id: user._id, email: user.email, phone: user.phone },
        };
  
        // Save to DB
        await Notification.create(notifData);
  
        // Emit via socket
        io.emit("new-user", notifData);
  
        // 🔹 Log to terminal for debugging
        console.log("🔔 Notification emitted (register):", notifData);
      }
  
      // Generate OTP
      if (email) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        return res.status(200).json({ status: 200, message: "OTP sent to email" });
      }
  
      if (phone) {
        return res.status(200).json({ status: 200, message: "OTP sent to phone number" });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      return res.status(500).json({ status: 500, message: "Server error" });
    }
  };
  
  // ------------------- Verify OTP & Login -------------------
  const User_verifyOtp = async (req, res) => {
    try {
      const { email, phone, otp, firebaseToken } = req.body;
      const io = getIo(); // Socket instance
  
      if (!email && !phone) {
        return res.status(400).json({ status: 400, message: "Email or phone required" });
      }
  
      let user;
  
      // ---------------- EMAIL OTP VERIFY ----------------
      if (email) {
        if (!otp) return res.status(400).json({ status: 400, message: "OTP required" });
  
        user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
  
        const result = VerifyOTP(user.otp, user.otpExpiry, otp);
        if (!result.status) return res.status(400).json({ status: 400, message: result.message });
  
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
      }
  
      // ---------------- PHONE OTP VERIFY (FIREBASE) ----------------
      if (phone) {
        if (!firebaseToken) return res.status(400).json({ status: 400, message: "Firebase token required" });
  
        const decoded = await firebase_token.auth().verifyIdToken(firebaseToken);
        if (decoded.phone_number !== phone) return res.status(401).json({ status: 401, message: "Phone verification failed" });
  
        user = await User.findOne({ phone });
        if (!user) {
          user = await User.create({ phone, isVerified: true });
        } else {
          user.isVerified = true;
          await user.save();
        }
      }
  
      // ---------------- CREATE JWT ----------------
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      // 🔔 Emit notification for login
      const loginNotif = {
        message: `User logged in: ${email || phone}`,
        type: "user-login",
        user: { id: user._id, email: user.email, phone: user.phone },
        timestamp: new Date(),
      };
      io.emit("user-login", loginNotif);
      await Notification.create(loginNotif);
      console.log("🔔 Notification emitted (login):", loginNotif);
  
      return res.status(200).json({
        status: 200,
        message: "Login successful",
        data: {
          user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isVerified: user.isVerified },
          token,
        },
      });
    } catch (error) {
      console.error("Verify OTP Error:", error);
      return res.status(500).json({ status: 500, message: "Server error during OTP verification" });
    }
  };

// ------------------- Get User Profile -------------------
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-otp -otpExpiry");

        if (!user)
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });

        return res.status(200).json({
            status: 200,
            message: "User profile fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error("Get User Profile Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error fetching profile",
        });
    }
};

// ------------------- Update User Profile -------------------
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });

        const { name } = req.body;
        if (name) user.name = name;

        if (req.file) {
            const imagePath = `/uploads/photos/${req.file.filename}`;
            if (
                user.profileImage &&
                fs.existsSync(path.join(__dirname, "..", user.profileImage))
            ) {
                fs.unlinkSync(path.join(__dirname, "..", user.profileImage));
            }
            user.profileImage = imagePath;
        }

        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Update User Profile Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error updating profile",
        });
    }
};

// ------------------- Get All Users (Admin only) -------------------
const getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();

        const users = await User.find()
            .select("-otp -otpExpiry")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 200,
            message: "User list fetched successfully",
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: users,
        });
    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error fetching user list",
        });
    }
};

// ------------------- Delete User -------------------
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user)
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            status: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error deleting user",
        });
    }
};

module.exports = {
    User_sendOtp,
    User_verifyOtp,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
};
