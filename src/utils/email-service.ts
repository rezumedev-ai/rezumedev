
import { supabase } from "@/integrations/supabase/client";

type EmailType = "auth" | "reset" | "invite" | "other";

interface SendEmailParams {
  email: string;
  subject: string;
  html: string;
  type: EmailType;
}

/**
 * Sends a system email using the Supabase Edge Function
 */
export const sendSystemEmail = async ({
  email,
  subject,
  html,
  type,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-system-email", {
      body: {
        email,
        subject,
        html,
        type,
      },
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<{ success: boolean; error?: string }> => {
  const subject = "Reset Your Rezume.dev Password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Reset Your Rezume.dev Password</h2>
      <p>You requested to reset your password. Please click the link below to reset it:</p>
      <p><a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>The link will expire in 24 hours.</p>
      <p>Best regards,<br>The Rezume.dev Team</p>
    </div>
  `;
  
  return sendSystemEmail({
    email,
    subject,
    html,
    type: "reset"
  });
};

/**
 * Sends a welcome email after sign up
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<{ success: boolean; error?: string }> => {
  const subject = "Welcome to Rezume.dev!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Welcome to Rezume.dev, ${name}!</h2>
      <p>Thank you for joining our platform. We're excited to help you create professional resumes that stand out.</p>
      <p>Here are some things you can do to get started:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Create your first resume</li>
        <li>Explore our templates</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The Rezume.dev Team</p>
    </div>
  `;
  
  return sendSystemEmail({
    email,
    subject,
    html,
    type: "auth"
  });
};
