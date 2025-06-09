import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/email';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Send notification email to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">🎉 New Collection Subscription</h2>
                <p style="font-size: 16px; color: #666;">Someone just subscribed to the new collection notification!</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Subscriber Email:</strong> ${email}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #888; font-size: 14px;">This is an automated notification from your website's collection subscription form.</p>
                </div>
            </div>
        `;

        // Send notification to admin
        const adminResult = await sendEmail({
            to: 'mymessageclothing@gmail.com',
            subject: '🎉 New Collection Subscriber',
            html: adminEmailHtml
        });

        if (!adminResult.success) {
            throw new Error('Failed to send admin notification');
        }

        return NextResponse.json({ 
            message: 'Successfully subscribed to waitlist'
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to process subscription' },
            { status: 500 }
        );
    }
} 