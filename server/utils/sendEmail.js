const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;