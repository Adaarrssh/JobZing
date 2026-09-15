import "dotenv/config";
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASSWORD) {
    throw new Error("Email configuration is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"JobZing" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("JobZing email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("JobZing email error:", {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });

    throw error;
  }
};

export default sendEmail;
