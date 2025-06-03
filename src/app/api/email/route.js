import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, subject, body } = await request.json();

    // In a real application, you would integrate with an email service here (e.g., Nodemailer, SendGrid, Mailgun)
    // For demonstration purposes, we'll just log the email details.
    console.log('--- Simulating Email Send ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('-----------------------------');

    // Simulate a successful email send
    return NextResponse.json({ success: true, message: 'Email simulated successfully.' });
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email.', error: error.message }, { status: 500 });
  }
}
