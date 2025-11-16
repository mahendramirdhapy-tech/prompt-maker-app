// pages/api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required' 
    });
  }

  try {
    // EmailJS API call with environment variables
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: name,
          from_email: email,
          subject: `Contact Form: ${subject}`,
          message: message,
          to_email: 'aipromptmakerinfo@gmail.com',
          reply_to: email,
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        }
      })
    });

    if (emailjsResponse.ok) {
      console.log('✅ Email sent successfully to aipromptmakerinfo@gmail.com');
      res.status(200).json({ 
        success: true,
        message: 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.' 
      });
    } else {
      const errorText = await emailjsResponse.text();
      console.error('❌ EmailJS error:', errorText);
      throw new Error('Email sending failed');
    }

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.' 
    });
  }
}
