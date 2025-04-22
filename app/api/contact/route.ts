import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    console.log("Contact form submission received:", {
      name,
      email,
      subject,
      message,
      to: "3xa.brand@gmail.com",
      timestamp: new Date().toISOString(),
    })

    // In a real implementation, you would send an email here using a service
    // that works with Vercel's environment, such as:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - Mailchimp (https://mailchimp.com)

    // Example with Resend (you would need to install the resend package):
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: '3xa.brand@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: "Message received. We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ success: false, message: "Failed to process your request" }, { status: 500 })
  }
}
