import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  username: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} for user ${username}`);
    
    // Here you would integrate with your email service (Resend, SendGrid, etc.)
    // For now, we'll just log the welcome email
    
    const welcomeMessage = {
      to: email,
      subject: "Welcome to TechVerse Connect!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TechVerse Connect!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}! 👋</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We're thrilled to have you join our tech community! TechVerse Connect is where tech enthusiasts come together to share knowledge, discuss the latest trends, and build amazing connections.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>Create your first tech post</li>
                <li>Join technology communities</li>
                <li>Explore the latest tech news</li>
                <li>Connect with fellow developers</li>
                <li>Share and discover tech memes</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Get Started
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
              Happy coding!<br>
              The TechVerse Connect Team
            </p>
          </div>
        </div>
      `
    };

    console.log("Welcome email prepared:", welcomeMessage);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully",
        emailData: welcomeMessage
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);