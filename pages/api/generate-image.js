// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  const HORD_API_KEY = process.env.HORD_AI_API_KEY;

  if (!HORD_API_KEY) {
    return res.status(500).json({ error: 'Hord AI key missing' });
  }

  try {
    // Step 1: Get available styles
    const stylesRes = await axios.get('https://api.hord.ai/v1/collections', {
      headers: { Authorization: `Bearer ${HORD_API_KEY}` }
    });

    // Step 2: Find first image model with a style
    let styleId = null;
    for (const model of stylesRes.data) {
      if (model.type === 'image' && model.styles?.[0]?.id) {
        styleId = model.styles[0].id;
        break;
      }
    }

    if (!styleId) {
      return res.status(500).json({ error: 'No image style found' });
    }

    // Step 3: Generate image
    const imgRes = await axios.post(
      'https://api.hord.ai/v1/images/generate',
      {
        prompt,
        style_id: styleId, // ← यह ज़रूरी है
        width: 512,
        height: 512
      },
      {
        headers: { Authorization: `Bearer ${HORD_API_KEY}` },
        responseType: 'arraybuffer'
      }
    );

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(Buffer.from(imgRes.data, 'binary'));
  } catch (error) {
    console.error('Hord error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
