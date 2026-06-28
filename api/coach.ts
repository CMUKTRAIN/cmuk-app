import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "DEEPSEEK_API_KEY is not set" });
  }

  const client = new OpenAI({
    apiKey: key,
    baseURL: "https://api.deepseek.com/v1",
  });

  try {
    const { message, history } = req.body;

    const systemPrompt = `You are the Culinary Medicine UK (CMUK) AI Food Coach...`; // your full prompt here

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (history && Array.isArray(history)) {
      for (const turn of history) {
        messages.push({
          role: turn.role === "user" ? "user" : "assistant",
          content: turn.text,
        });
      }
    }

    messages.push({ role: "user", content: message || "Hello!" });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.json({ text: responseText });
  } catch (error: any) {
    console.error("DeepSeek API error:", error);
    return res.status(500).json({ error: error.message || "AI coach error" });
  }
}
