import nodemailer from "nodemailer";

interface MagicLinkMailerProps {
  name: string;
  email: string;
  magicLink: string;
}

const MagicLinkMailer = async ({
  name,
  email,
  magicLink,
}: MagicLinkMailerProps) => {
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
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; text-align: center;">
        <div style="max-width: 450px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 8px;">🔐 Secure Login</h2>
          <p style="font-size: 16px; color: #555;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #555;">Click the button below to log in securely:</p>

          <a href="${magicLink}" 
            style="display: inline-block; padding: 12px 20px; font-size: 18px; font-weight: bold; color: #ffffff; 
                    background: #4CAF50; text-decoration: none; border-radius: 5px; transition: background 0.3s;">
            Login Now
          </a>

          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If the button doesn't work, copy and paste the following link into your browser:
          </p>
          <p style="font-size: 14px; color: #555; word-break: break-word;">${magicLink}</p>

          <div style="margin-top: 30px; font-size: 12px; color: #999;">
            If you didn't request this, you can safely ignore this email.
          </div>
        </div>
      </div>
    `;

    let info = await transporter.sendMail({
      from: `"FairShare" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: "FairShare | Magic Link",
      html: htmlMessage,
    });

    return info;
  } catch (error) {
    console.error("Error sending Magic Link email:", error);
    throw error;
  }
};

export default MagicLinkMailer;
