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
const SITE_URL = process.env.SITE_URL || 'https://prompt-maker-app.vercel.app';
const APP_NAME = 'PromptMaker';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { idea, language = 'English' } = req.body;
  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'Valid "idea" string required' });
  }

  // Adjust system prompt based on language
  const langInstruction = language === 'Hindi' 
    ? 'Output must be in Hindi.'
    : 'Output must be in English.';

  const systemPrompt = `You are an expert AI prompt engineer. Convert the user's rough idea into a clear, detailed, and effective prompt that can be used with LLMs. Include context, tone, format, and constraints if needed. ${langInstruction} Respond ONLY with the final prompt, no other text.`;

  for (const model of FREE_MODELS) {
    try {
      console.log(`[API] Trying model: ${model} | Language: ${language}`);
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: idea.trim() },
          ],
          max_tokens: 600,
          temperature: 0.7,
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
