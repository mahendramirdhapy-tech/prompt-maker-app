// pages/api/generate.js
import axios from 'axios';

const FREE_MODELS = [
  'google/gemma-2-2b-it',
  'meta-llama/llama-3.2-3b-instruct',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen-2.5-7b-instruct',
  'cognitivecomputations/dolphin-mixtral-8x7b',
];

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://aipromptmaker.online';
const APP_NAME = 'PromptMaker';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { idea, language = 'English', tone = 'Professional', maxTokens = 600, type = 'prompt' } = req.body;

  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'Valid "idea" string required' });
  }

  // 🔹 Build system prompt based on type
  let systemPrompt = "";
  if (type === 'social') {
    systemPrompt = `You are a social media expert. Generate an engaging ${language} post for: ${idea}. Include 3-5 relevant hashtags. Respond ONLY with the post text, no explanations.`;
  } else if (type === 'image') {
    systemPrompt = `Describe a detailed, vivid image based on: ${idea}. Include style, mood, lighting, and key visual elements. One paragraph only. No markdown, no quotes.`;
  } else {
    const langInstruction = language === 'Hindi'
      ? 'Output must be in Hindi.'
      : 'Output must be in English.';
    systemPrompt = `You are an expert AI prompt engineer. Convert the user's rough idea into a clear, detailed, and effective prompt that can be used with large language models. 
Tone: ${tone}.
${langInstruction}
Respond ONLY with the final prompt, no explanations.`;
  }

  // 🔹 Set temperature based on tone (only for non-image types)
  let temperature = 0.7;
  if (type !== 'image') {
    if (tone === 'Creative' || tone === 'Humorous') temperature = 0.9;
    else if (tone === 'Professional' || tone === 'Technical') temperature = 0.3;
    else if (tone === 'Friendly') temperature = 0.6;
  }

  for (const model of FREE_MODELS) {
    try {
      console.log(`[API] Trying model: ${model} | Type: ${type} | Tone: ${tone}`);

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: idea.trim() },
          ],
          max_tokens: Math.min(Math.max(maxTokens, 100), 1000),
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': SITE_URL,
            'X-Title': APP_NAME,
          },
          timeout: 15000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content?.trim();
      if (content) {
        return res.status(200).json({
          success: true,
          prompt: content,
          modelUsed: model,
          language,
          tone,
          maxTokens,
        });
      }
    } catch (error) {
      console.warn(`[API] Model ${model} failed:`, error.message || error);
    }
  }

  return res.status(500).json({
    success: false,
    error: 'All free models are currently unavailable. Please try again later.',
  });
}
