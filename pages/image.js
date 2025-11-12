// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt required' });
  }

  const HORDE_KEY = '0000000000'; // anonymous key
  const CLIENT_AGENT = 'PromptMaker:1.0';

  try {
    // Submit async request
    const submit = await axios.post(
      'https://aihorde.net/api/v2/generate/async',
      {
        prompt,
        params: { width: 512, height: 512, steps: 30, n: 1 },
        nsfw: false,
        censor_nsfw: true,
        models: ['stable_diffusion']
      },
      {
        headers: {
          'apikey': HORDE_KEY,
          'Client-Agent': CLIENT_AGENT,
          'Content-Type': 'application/json'
        }
      }
    );

    const id = submit.data.id;
    if (!id) throw new Error('No ID');

    // Poll for result
    let done = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const status = await axios.get(`https://aihorde.net/api/v2/generate/status/${id}`, {
        headers: { 'apikey': HORDE_KEY, 'Client-Agent': CLIENT_AGENT }
      });
      if (status.data.done) {
        const imgUrl = status.data.generations[0]?.img;
        if (!imgUrl) throw new Error('No image');
        
        const img = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/png');
        return res.status(200).send(Buffer.from(img.data));
      }
    }
    throw new Error('Timeout');
  } catch (e) {
    console.error('AI Horde Error:', e.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
