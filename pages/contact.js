// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if Gmail password is set
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_APP_PASSWORD environment variable is not set');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aipromptmakerinfo@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('SMTP connection verified');

    // Email content for you
    const mailOptions = {
      from: `"${name}" <aipromptmakerinfo@gmail.com>`,
      replyTo: email, // So you can reply directly to the user
      to: 'aipromptmakerinfo@gmail.com',
      subject: `Website Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            🚀 New Contact Form Submission - AI Prompt Maker
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
            <p><strong style="color: #374151;">Name:</strong> ${name}</p>
            <p><strong style="color: #374151;">Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            <p><strong style="color: #374151;">Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">💬 Message</h3>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>📧 Sent from AI Prompt Maker Contact Form</p>
            <p>⏰ Received: ${new Date().toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full',
              timeStyle: 'medium'
            })}</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // More detailed error logging
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check Gmail App Password.');
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message. Please try again later.' 
    });
  }
}
