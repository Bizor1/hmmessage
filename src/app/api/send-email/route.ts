import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, subject, message, name } = body;

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Prepare email content
    let emailSubject = subject || 'New Message from Website';
    let emailText = message;
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from Website</h2>
        <p><strong>From:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <div style="margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>This email was sent from the MyMessage Clothing website contact form.</p>
        </div>
      </div>
    `;

    // Send email
    const result = await sendEmail({
      to: 'mymessageclothing@gmail.com',
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!result.success) {
      console.error('Email sending failed:', result.error, result.details);
      return NextResponse.json(
        { error: 'Failed to send email', details: result.details },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 