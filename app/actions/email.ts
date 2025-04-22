"use server"

import { Resend } from "resend"

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Log the submission for debugging and as a backup
  console.log("Contact form submission:", {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  })

  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn("Resend API key not configured. Email not sent.")
      return {
        success: true, // Return success to the user even though email wasn't sent
        message: "Your message has been received. We'll get back to you soon.",
        sent: false,
      }
    }

    // Send email using Resend
    // With a free Resend account, we can only send to the verified email address
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Default sender for Resend testing
      to: ["3x.a.brand@gmail.com"], // The verified email address
      subject: `Contact Form: ${subject}`,
      reply_to: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        message: "There was a problem sending your message. Please try again later.",
        error: error.message,
      }
    }

    return {
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon.",
      sent: true,
      id: data?.id,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
