import nodemailer from 'nodemailer';

// Create reusable transporter object using Zoho SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD
    }
});

export async function sendEmail({
    to,
    subject,
    html,
    replyTo
}: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
}) {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.ZOHO_EMAIL, // Your verified Zoho email
            to,
            subject,
            html,
            replyTo
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
} 