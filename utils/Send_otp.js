const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const SendOTP = async (email) => {
  try {
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL, // your gmail
        pass: process.env.SMTP_PASSWORD, // app password
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP for Login",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Your OTP Code</h3>
          <p>Your OTP is: <b>${otp}</b></p>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error("Send OTP Error:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = SendOTP;
