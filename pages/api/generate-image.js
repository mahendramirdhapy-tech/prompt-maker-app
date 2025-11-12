// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid "prompt" string required' });
  }

  // AI Horde allows anonymous usage
  const HORDE_API_KEY = process.env.HORDE_API_KEY || '0000000000';
  const CLIENT_AGENT = 'PromptMaker:1.0'; // Required by AI Horde

  try {
    // Step 1: Submit async request
    const submitRes = await axios.post(
      'https://aihorde.net/api/v2/generate/async',
      {
        prompt,
        params: {
          width: 512,
          height: 512,
          steps: 30,
          n: 1,
          sampler_name: 'k_euler',
        },
        nsfw: false,
        censor_nsfw: true,
        models: ['stable_diffusion'],
      },
      {
        headers: {
          'apikey': HORDE_API_KEY,
          'Client-Agent': CLIENT_AGENT,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const generateId = submitRes.data.id;
    if (!generateId) {
      throw new Error('No generate ID returned');
    }

    // Step 2: Poll for result (max 60 seconds)
    let retries = 0;
    const maxRetries = 30;

    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s

      const statusRes = await axios.get(
        `https://aihorde.net/api/v2/generate/status/${generateId}`,
        {
          headers: {
            'apikey': HORDE_API_KEY,
            'Client-Agent': CLIENT_AGENT,
          },
          timeout: 10000,
        }
      );

      if (statusRes.data.done) {
        const imageUrl = statusRes.data.generations[0]?.img;
        if (!imageUrl) throw new Error('No image URL in response');
        
        // Step 3: Download and return image
        const imgBuffer = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 10000,
        });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(Buffer.from(imgBuffer.data, 'binary'));
      }

      retries++;
    }

    throw new Error('Image generation timed out');
  } catch (error) {
    console.error('🔥 AI Horde Error:', error.message);
    res.status(500).json({
      error: 'Image generation failed. Please try again.',
    });
  }
}
