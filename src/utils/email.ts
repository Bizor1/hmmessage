import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Using 'gmail' service instead of manual host/port
    auth: {
        user: 'mymessageclothing@gmail.com',
        pass: 'awoh cckr bjao jtqf',  // Your app password
    },
});

// Verify the connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
        // Add a default subject if none provided
        const finalSubject = subject || 'New Message from MyMessage Clothing';

        const mailOptions = {
            from: {
                name: 'MyMessage Clothing',
                address: 'mymessageclothing@gmail.com'
            },
            to,
            subject: finalSubject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        // Add more detailed error information
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { 
            success: false, 
            error: errorMessage,
            details: 'Failed to send email. Please check SMTP configuration and credentials.'
        };
    }
} 