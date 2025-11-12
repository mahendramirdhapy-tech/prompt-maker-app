// pages/api/hord-styles.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const HORD_API_KEY = process.env.HORD_AI_API_KEY;
  if (!HORD_API_KEY) {
    return res.status(500).json({ error: 'Hord AI key not configured' });
  }

  try {
    // Hord AI: Get all collections/models
    const response = await axios.get('https://api.hord.ai/v1/collections', {
      headers: { Authorization: `Bearer ${HORD_API_KEY}` }
    });

    // Extract styles from image-type models
    const styles = [];
    for (const model of response.data) {
      if (model.type === 'image' && Array.isArray(model.styles)) {
        for (const style of model.styles) {
          styles.push({
            id: style.id,
            name: style.name,
            modelId: model.id,
            modelName: model.name
          });
        }
      }
    }

    res.status(200).json(styles);
  } catch (error) {
    console.error('Hord styles error:', error.message);
    res.status(500).json({ error: 'Failed to fetch styles' });
  }
}
