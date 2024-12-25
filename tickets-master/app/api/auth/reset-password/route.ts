import { kv } from '@vercel/kv';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for UUID generation
import CryptoJS from 'crypto-js'; // Importing crypto-js for hashing

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    // Validate the new password
    const parsed = z.object({
      newPassword: z.string().min(6),
    }).safeParse({ newPassword });

    if (!parsed.success) {
      return Response.json({ message: 'Invalid password' }, { status: 400 }); // Bad Request
    }

    // Retrieve the token data directly
    const tokenData = await kv.hgetall(`user:token:${token}`);
    if (!tokenData || !tokenData.email) {
      return Response.json({ message: 'Invalid token' }, { status: 400 });
    }

    const email = tokenData.email;

    // Check if the token has expired
    if (Date.now() > Number(tokenData.tokenExpires)) {
      return Response.json({ message: 'Token has expired' }, { status: 400 });
    }

    // Generate salt and hash password
    const salt = uuidv4(); // Using uuid to generate a unique salt
    const saltedPassword = newPassword + salt; // Concatenate new password with salt
    const hashedPassword = CryptoJS.SHA256(saltedPassword).toString(); // Hashing the new password

    // Update the user's password in the database and remove the reset token
    await kv.hset(`user:${email}`, { 
      password: hashedPassword, 
      salt,
    });

    // Remove the token after use
    await kv.del(`user:token:${token}`);

    return Response.json({ message: 'Password has been reset' }, { status: 200 }); // OK
  } catch (error) {
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 }); // Server Error
  }
}

export async function GET() {
  return new Response('Method GET Not Allowed', {
    status: 405,
    headers: { 'Allow': `${['POST']}` },
  })
}