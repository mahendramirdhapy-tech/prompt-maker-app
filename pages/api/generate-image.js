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

  const HORDE_API_KEY = process.env.HORDE_API_KEY || '0000000000';

  try {
    // Step 1: Submit async request
    const submitRes = await axios.post(
      'https://aihorde.net/api/v2/generate/async', // ✅ No spaces
      {
        prompt,
        params: { width: 512, height: 512, steps: 30, n: 1, sampler_name: 'k_euler' },
        nsfw: false,
        censor_nsfw: true,
        models: ['stable_diffusion'],
      },
      {
        headers: { 'apikey': HORDE_API_KEY, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const generateId = submitRes.data.id;
    if (!generateId) throw new Error('No ID');

    // Step 2: Poll for result
    let retries = 0;
    const maxRetries = 30;
    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const checkRes = await axios.get(
        `https://aihorde.net/api/v2/generate/check/${generateId}`, // ✅ No spaces
        { headers: { 'apikey': HORDE_API_KEY }, timeout: 10000 }
      );
      if (checkRes.data.done) break;
      retries++;
    }
    if (retries >= maxRetries) throw new Error('Timeout');

    // Step 3: Get image
    const fetchRes = await axios.get(
      `https://aihorde.net/api/v2/generate/status/${generateId}`, // ✅ No spaces
      { headers: { 'apikey': HORDE_API_KEY }, timeout: 10000 }
    );

    const imageUrl = fetchRes.data.generations[0]?.img;
    if (!imageUrl) throw new Error('No image');

    // Step 4: Return image
    const imgBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(Buffer.from(imgBuffer.data, 'binary'));
  } catch (error) {
    console.error('AI Horde Error:', error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
