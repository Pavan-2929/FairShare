import nodemailer from "nodemailer";

interface InvoiceMailerProps {
  name: string;
  email: string;
  pdf: Buffer;
  clientName: string;
  clientEmail: string;
}

const InvoiceMailer = async ({
  name,
  email,
  pdf,
  clientName,
  clientEmail,
}: InvoiceMailerProps) => {
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
          <h2 style="color: #007BFF;">Hello, ${clientName}!</h2>
          <p style="font-size: 16px; color: #555;">Your invoice prepared by ${name} is ready and attached below. Click the link to download the PDF.</p>
          
          <p style="font-size: 16px; color: #555;">If you have any questions, feel free to reach out to our support team.</p>

          <div style="margin-top: 30px; font-size: 12px; color: #888;">
            Best regards,<br/>The FairShare Team
          </div>
        </div>
      </div>
    `;

    let info = await transporter.sendMail({
      from: `"FairShare" <${process.env.NODE_EMAIL}>`,
      to: clientEmail,
      cc: email,
      subject: `FairShare | Invoice from ${name}`,
      html: htmlMessage,
      attachments: [
        {
          filename: `Invoice_Report-${clientName}.pdf`,
          content: pdf,
          encoding: "base64",
        },
      ],
    });

    return info;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};

export default InvoiceMailer;
