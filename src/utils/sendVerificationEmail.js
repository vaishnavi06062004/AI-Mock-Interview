import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `http://localhost:5000/auth/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email for AI Mock Interview",
      html: `
        <p>Hello!</p>
        <p>Please verify your email by clicking below link:</p>
        <a href="${verificationLink}" target="_blank">Verify Email</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
