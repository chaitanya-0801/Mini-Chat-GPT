import nodemailer from "nodemailer";

export const sendMail = async (email, subject, text) => {
  try {
    const transporter = await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: '"ChatGoAI" <no-reply@yourapp.com>',
      to: email,
      subject,
      html: `<b>${text}</b>`,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
