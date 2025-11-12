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

  // Optional: Get API key (AI Horde allows anonymous usage, but key gives priority)
  const HORDE_API_KEY = process.env.HORDE_API_KEY || '0000000000'; // anonymous key

  try {
    // Step 1: Submit image generation request
    const submitRes = await axios.post(
      'https://aihorde.net/api/v2/generate/async',
      {
        prompt: prompt,
        params: {
          width: 512,
          height: 512,
          steps: 30,
          n: 1,
          sampler_name: 'k_euler',
        },
        nsfw: false,
        censor_nsfw: true,
        models: ['stable_diffusion'], // or specify a model like 'Deliberate'
      },
      {
        headers: {
          'apikey': HORDE_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const generateId = submitRes.data.id;
    if (!generateId) {
      throw new Error('No generate ID returned');
    }

    // Step 2: Poll for result (up to 60 seconds)
    let retries = 0;
    const maxRetries = 30;
    let checkRes;

    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s

      checkRes = await axios.get(`https://aihorde.net/api/v2/generate/check/${generateId}`, {
        headers: { 'apikey': HORDE_API_KEY }
      });

      if (checkRes.data.done) break;
      retries++;
    }

    if (!checkRes?.data?.done) {
      throw new Error('Image generation timed out');
    }

    // Step 3: Fetch the image
    const fetchRes = await axios.get(`https://aihorde.net/api/v2/generate/status/${generateId}`, {
      headers: { 'apikey': HORDE_API_KEY }
    });

    const imageUrl = fetchRes.data.generations[0]?.img;
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    // Step 4: Download image as binary
    const imgBuffer = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // Return image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(Buffer.from(imgBuffer.data, 'binary'));
  } catch (error) {
    console.error('🔥 AI Horde Error:', error.message);
    res.status(500).json({ error: 'Image generation failed. Please try again.' });
  }
}
