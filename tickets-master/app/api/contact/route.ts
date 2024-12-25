import nodemailer from 'nodemailer'

async function sendMessage({ name, email, subject, message, appName, domain }) {
  // Create a Nodemailer transporter object
  const transporter = nodemailer.createTransport({
    host: 'server.only.info',
    port: 465,
    secure: true, // true for 465, false for other ports
    tls: {rejectUnauthorized: false},
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASS
    },
  });

  // Define the email message
  const emailMessage = {
    from: `Contact Form <${process.env.SENDER_EMAIL}>`,
    to: `${appName} <info@${domain}>`,
    replyTo: `${name} <${email}>`,
    subject: `New 📨 from ${domain}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
  };

  await transporter.sendMail(emailMessage)
}

export async function POST(request: Request) {
  const reqData = await request.json()

  const name = reqData.name
  const email = reqData.email
  const subject = reqData.subject
  const message = reqData.message
  const appName = reqData.appName
  const domain = reqData.domain

  try {
    const body = {
      email,
      name,
      subject,
      message,
      appName,
      domain,
    }
    
    if (!body.name || !body.email || !body.subject || !body.message) {
      return Response.json('please_complete_form', {
        status: 500,
      })
    }
    
    await sendMessage(body)
    return Response.json(`thanks_for_contact`, {
      status: 200,
    })
  } catch (error) {
    console.error('Error sending contact message:', error)
    return Response.json('something_went_wrong', {
      status: 500,
    })
  }
}

export async function GET() {
  return new Response('Method GET Not Allowed', {
    status: 405,
    headers: { 'Allow': `${['POST']}` },
  })
}