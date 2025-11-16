// pages/api/contact.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required' 
    })
  }

  try {
    // Supabase mein contact submission save karein
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          status: 'new',
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('✅ Contact form submitted:', { name, email, subject })

    res.status(200).json({ 
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you within 24 hours.',
      data: data
    })

  } catch (error) {
    console.error('❌ Error saving contact form:', error)
    
    res.status(500).json({ 
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later or email us directly at aipromptmakerinfo@gmail.com.'
    })
  }
}
