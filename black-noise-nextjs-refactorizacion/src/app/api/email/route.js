import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import logger from '@/utils/logger';

export async function POST(request) {
  try {
    const { to, subject, body } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use 'true' if your SMTP server uses SSL/TLS (usually port 465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body, // Use html for rich text, or text for plain text
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    logger.error('Error in email API route:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email.', error: error.message }, { status: 500 });
  }
}
