import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

serve(async (req) => {
  try {
    const { email, invitationToken, freelancerName } = await req.json();
    
    // Here you would integrate with your email service (SendGrid, etc.)
    // For now, we'll just log the data
    console.log(`Invitation email would be sent to ${email} with token ${invitationToken}`);

    const inviteUrl = `${FRONTEND_URL}/client/accept-invitation?token=${invitationToken}`;

    // Return success response
    return new Response(
      JSON.stringify({ message: "Invitation sent successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});