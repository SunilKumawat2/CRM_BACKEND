

const User = require("../models/Users")
// <------------ Verify Otp---------------->
const VerifyOTP = (storedOtp, storedExpiry, enteredOtp) => {
    if (!storedOtp || !storedExpiry) {
      return { status: false, message: "OTP not found" };
    }
  
    if (storedExpiry < Date.now()) {
      return { status: false, message: "OTP expired" };
    }
  
    if (storedOtp !== enteredOtp) {
      return { status: false, message: "Invalid OTP" };
    }
  
    return { status: true, message: "OTP verified successfully" };
  };
  
  module.exports = VerifyOTP;
  


module.exports = {VerifyOTP}