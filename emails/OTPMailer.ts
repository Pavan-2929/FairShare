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
      <div style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 40px 0; text-align: center;">
        <div style="max-width: 450px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 8px;">🔐 Your OTP Code</h2>
          <p style="color: #555; font-size: 16px;">Hello <strong>${name}</strong>, use the OTP below to verify your identity.</p>
          
          <p style="display: inline-block; background: #4CAF50; color: #ffffff; padding: 8px 16px; font-size: 18px; font-weight: bold; border-radius: 8px; letter-spacing: 2px; margin: 20px 0;">${OTP}</p>
          
          <p style="color: #777; font-size: 14px;">This OTP is valid for a short time. Please do not share it with anyone.</p>
          <p style="color: #777; font-size: 14px;">If you didn’t request this, you can safely ignore this email.</p>

          <div style="margin-top: 25px; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 12px;">
            Need help? <a href="mailto:support@fairshare.com" style="color: #4CAF50; text-decoration: none;">Contact Support</a>
            <br/><br/>
            <strong>FairShare Team</strong>
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
