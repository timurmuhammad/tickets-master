import { kv } from '@vercel/kv'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const { email, appName, domain } = await request.json();

  // Check if the user exists
  const user = await kv.hgetall(`user:${email}`);
  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  // Generate a password reset token
  const resetToken = uuidv4(); // Using uuid to generate a unique token
  const tokenExpiration = Date.now() + 10800000; // 3 hours expiration

  // Store the token and expiration under a specific key for the user
  await kv.hset(`user:token:${resetToken}`, { 
    email, 
    tokenExpires: tokenExpiration 
  });

  // Send email with the reset link
  const transporter = nodemailer.createTransport({
    host: 'server.only.info',
    port: 465,
    secure: true, // true for 465, false for other ports
    tls: { rejectUnauthorized: false },
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASS
    },
  });

  const resetLink = `https://${domain}/reset-password?token=${resetToken}`;
  try {
    await transporter.sendMail({
      from: `${appName} <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`, // Updated to use HTML
    });
    return Response.json({ message: 'Password reset link sent' }, { status: 200 }); // Added status 200
  } catch (error) {
    return Response.json({ message: 'Failed to send email' }, { status: 500 }); // Added error handling
  }
}

export async function GET() {
  return new Response('Method GET Not Allowed', {
    status: 405,
    headers: { 'Allow': `${['POST']}` },
  });
}