// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt required' });
  }

  const HORDE_KEY = process.env.HORDE_API_KEY || '0000000000'; // anonymous

  try {
    // Step 1: Submit async request
    const submit = await axios.post(
      'https://aihorde.net/api/v2/generate/async',
      {
        prompt,
        params: { width: 512, height: 512, steps: 30, n: 1 },
        nsfw: false,
        censor_nsfw: true,
        models: ['stable_diffusion']
      },
      { headers: { apikey: HORDE_KEY } }
    );

    const id = submit.data.id;
    if (!id) throw new Error('No ID');

    // Step 2: Wait for completion (max 60s)
    let done = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const status = await axios.get(`https://aihorde.net/api/v2/generate/check/${id}`, {
        headers: { apikey: HORDE_KEY }
      });
      if (status.data.done) { done = true; break; }
    }

    if (!done) throw new Error('Timeout');

    // Step 3: Get image URL
    const result = await axios.get(`https://aihorde.net/api/v2/generate/status/${id}`, {
      headers: { apikey: HORDE_KEY }
    });

    const imgUrl = result.data.generations[0]?.img;
    if (!imgUrl) throw new Error('No image');

    // Step 4: Proxy image to client
    const img = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(Buffer.from(img.data));
  } catch (e) {
    console.error('AI Horde Error:', e.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
