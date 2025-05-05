"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { sendContactEmail } from "@/app/actions/email"

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    try {
      const formData = new FormData(event.currentTarget)
      const response = await sendContactEmail(formData)

      setResult({
        success: response.success,
        message: response.message,
      })

      if (response.success && formRef.current) {
        // Reset form on success using the ref
        formRef.current.reset()

        // Hide success message after 5 seconds
        setTimeout(() => {
          setResult(null)
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setResult({
        success: false,
        message: "An error occurred while sending your message. Please try again later.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Send Us a Message</h2>

      {result ? (
        <div
          className={`flex flex-col items-center justify-center rounded-lg ${
            result.success ? "bg-emerald-50" : "bg-red-50"
          } p-6 text-center`}
        >
          {result.success ? (
            <CheckCircle2 className="mb-2 h-12 w-12 text-emerald-500" />
          ) : (
            <AlertCircle className="mb-2 h-12 w-12 text-red-500" />
          )}
          <h3 className="mb-2 text-xl font-medium">{result.success ? "Thank You!" : "Error"}</h3>
          <p className={result.success ? "text-gray-600" : "text-red-600"}>{result.message}</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" type="tel" placeholder="+92 XXX XXXXXXX" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="How can we help you?" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Write your message here..." rows={5} required />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  )
}
