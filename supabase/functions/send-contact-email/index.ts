
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

// Define permissive CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === "POST") {
      const { name, email, message }: ContactFormData = await req.json();
      
      console.log(`Received contact form submission from ${name} (${email})`);
      
      // Validate input
      if (!name || !email || !message) {
        console.error("Missing required fields in contact form submission");
        return new Response(
          JSON.stringify({ error: "All fields are required" }), 
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Send email to site owner
      const emailToOwner = await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: ["rezume.dev13@gmail.com"],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      console.log("Email to owner sent:", emailToOwner);

      // Send confirmation email to the user
      const emailToUser = await resend.emails.send({
        from: "Rezume.dev <onboarding@resend.dev>",
        to: [email],
        subject: "We've received your message!",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message and will get back to you soon.</p>
          <p>For your records, here's what you sent us:</p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <p>Best regards,<br>The Rezume.dev Team</p>
        `,
      });

      console.log("Confirmation email to user sent:", emailToUser);

      return new Response(
        JSON.stringify({ success: true }), 
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }), 
      { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
