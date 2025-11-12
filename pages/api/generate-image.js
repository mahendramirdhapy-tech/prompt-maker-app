// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;

  // Validate input
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid "prompt" string required' });
  }

  // Get Hord AI API key from environment
  const HORD_AI_API_KEY = process.env.HORD_AI_API_KEY;
  if (!HORD_AI_API_KEY) {
    console.error('❌ HORD_AI_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Image service not configured' });
  }

  try {
    // Call Hord AI API
    // ⚠️ Replace the URL below with your actual Hord AI endpoint if different
    const response = await axios.post(
      'https://api.hord.ai/v1/images/generate', // ✅ Confirm this is your correct endpoint
      {
        prompt: prompt,
        width: 512,
        height: 512,
        // Add other params if needed (e.g., model, style, etc.)
      },
      {
        headers: {
          'Authorization': `Bearer ${HORD_AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        // Important: We expect binary image data
        responseType: 'arraybuffer',
        timeout: 30000, // 30 seconds
      }
    );

    // Set headers for image response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 1 day
    res.setHeader('X-Generated-By', 'PromptMaker + Hord AI');

    // Send binary image data
    res.status(200).send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    console.error('🔥 Hord AI Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data ? JSON.stringify(error.response.data) : 'No response data'
    });

    // Return user-friendly error
    res.status(500).json({
      error: 'Failed to generate image. Please try again.'
    });
  }
}
