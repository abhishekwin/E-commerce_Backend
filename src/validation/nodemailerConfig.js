const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.Auth_service,
  auth: {
    user: process.env.Auth_email,
    pass: process.env.Auth_password,
  },
});

// Function to send reset password email
exports.sendResetPasswordEmail = async (recipientEmail, resetToken) => {
  const mailOptions = {
    from: process.env.Auth_email,
    to: recipientEmail,
    subject: "Password Reset Request",
    html: `
        <p>Click the following link to reset your password:</p>
        <a href="https://e-commerce-fe-beta.vercel.app/resetPassword?token=${resetToken}">Reset Password</a>
      `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};
