import nodemailer from "nodemailer";

interface OTPMailerProps {
  name: string;
  email: string;
  OTP: string;
}

const OTPMailer = async ({ name, email, OTP }: OTPMailerProps) => {
  try {
    let transporter = await nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT as string, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.NODE_PASS,
      },
    });

    let htmlMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #f8f8f8;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h2 style="color: #007BFF;">Welcome to FairShare, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">Thank you for signing up. To complete your registration, please use the OTP below:</p>
          
          <p style="font-size: 2em; font-weight: bold; color: #444;">${OTP}</p>
          
          <p style="font-size: 16px; color: #555;">If you did not sign up for this account, please ignore this email.</p>

          <div style="margin-top: 30px; font-size: 12px; color: #888;">
            Best regards,<br/>The FairShare Team
          </div>
        </div>
      </div>
    `;

    let info = await transporter.sendMail({
      from: `"FairShare" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: "FairShare | OTP Verification",
      html: htmlMessage,
    });

    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

export default OTPMailer;
