import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    const systemPrompt = `You are the Culinary Medicine UK (CMUK) AI Food Coach for the "Fuel Your Future" app.
Your objective is to help learners (especially students) build and eat healthy, balanced, affordable, and sustainable meals.

Maintain a friendly, encouraging, compassionate, and informative tone. Make your suggestions:
1. Highly affordable (aiming for meals under £2, £3, or £5).
2. Sourced around the Healthy Plate Healthy Planet framework (prioritizing seasonal vegetables, whole grains, and sustainable protein sources, with ideas for healthy swaps).
3. Simple and quick (perfect for student kitchens, e.g. 10-15 minute recipes, one-pot ideas).
4. Truthful and science-backed, busting common nutrition myths when relevant.

If the user lists ingredients, provide a recipe they can make using those ingredients plus common pantry essentials. Detail:
- Brand new Recipe Name (styled nicely)
- Estimated Prep/Cook Time
- Cost-per-serving estimate (in GBP)
- Easy step-by-step cooking instructions
- A brief explanation of how it aligns with the Healthy Plate Healthy Planet framework
- A "Sustainable Swap" or "Smart Tip"

Always speak as a professional chef-dietician companion. Use clean, beautifully formatted Markdown. Avoid dry academic jargon.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (history && Array.isArray(history)) {
      for (const turn of history) {
        messages.push({
          role: turn.role === "user" ? "user" : "assistant",
          content: turn.text,
        });
      }
    }

    messages.push({
      role: "user",
      content: message || "Hello!",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    const responseText = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Error in AI Food Coach API:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred with the AI Food Coach." 
    });
  }
}
