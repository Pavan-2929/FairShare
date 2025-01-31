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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #f8f8f8;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h2 style="color: #007BFF;">🔐 Secure Login</h2>
          <p style="font-size: 16px; color: #555;">Hello <b>${name}</b>,</p>
          <p style="font-size: 16px; color: #555;">Click the button below to log in securely:</p>
          
          <a href="${magicLink}" 
             style="display: inline-block; padding: 12px 20px; font-size: 18px; font-weight: bold; color: #ffffff; 
                    background: #007BFF; text-decoration: none; border-radius: 5px; transition: background 0.3s;">
            Login Now
          </a>
          
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If the button doesn't work, copy and paste the following link into your browser:
          </p>
          <p style="font-size: 14px; color: #555; word-break: break-word;">${magicLink}</p>
          
          <div style="margin-top: 30px; font-size: 12px; color: #888;">
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
