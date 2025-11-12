// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  const HORD_API_KEY = process.env.HORD_AI_API_KEY;

  if (!HORD_API_KEY) {
    return res.status(500).json({ error: 'Hord AI API key not configured' });
  }

  try {
    // Hord AI API call — adjust endpoint/response as per your API
    const response = await axios.post(
      'https://api.hord.ai/v1/images/generate', // ← अपना Hord AI endpoint डालें
      { 
        prompt, 
        width: 512, 
        height: 512 
      },
      {
        headers: {
          Authorization: `Bearer ${HORD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer'
      }
    );

    // Set headers for image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    console.error('Hord AI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
