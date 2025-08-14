// app/api/send-email/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
      const { to, subject, htmlContent } = await req.json();
  
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "Your Name or Store",
            email: process.env.Email, // Must be a verified sender on Brevo
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        return new NextResponse(JSON.stringify({ error: errorBody }), {
          status: response.status,
        });
      }
 
      return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }