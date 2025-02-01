import nodemailer from "nodemailer";

interface TransactionMailerProps {
  name: string;
  email: string;
  pdf: Buffer<ArrayBuffer>;
}

const TransactionMailer = async ({
  name,
  email,
  pdf,
}: TransactionMailerProps) => {
  try {
    let transporter = nodemailer.createTransport({
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
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h2 style="color: #007BFF;">Hello, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">Thank you for your transaction activity! Your report is ready and attached below. Click the link to download the PDF.</p>
          
          <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out to our support team.</p>

          <div style="margin-top: 30px; font-size: 12px; color: #888;">
            Best regards,<br/>The FairShare Team
          </div>
        </div>
      </div>
    `;

    // Send the email with the attached PDF
    let info = await transporter.sendMail({
      from: `"FairShare" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: `FairShare | Transaction Report`,
      html: htmlMessage,
      attachments: [
        {
          filename: `Transaction_Report-${name}.pdf`,
          content: pdf,
          encoding: "base64", // Ensure it's properly encoded
        },
      ],
    });

    return info;
  } catch (error) {
    console.error("Error sending transaction report email:", error);
    throw error;
  }
};

export default TransactionMailer;
