import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import { handleSubscribe } from './server/routes/subscribe.js';
import { handleConfirm } from './server/routes/confirm.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Lazy initialization of DeepSeek client
let aiClient: OpenAI | null = null;

function getDeepSeekClient(): OpenAI {
  if (!aiClient) {
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
      throw new Error("DEEPSEEK_API_KEY environment variable is missing");
    }
    aiClient = new OpenAI({
      apiKey: key,
      baseURL: "https://api.deepseek.com/v1",
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/coach", async (req, res) => {
  try {
    const { message, history } = req.body;
    const client = getDeepSeekClient();

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
});

// Opt-in routes
app.post("/api/subscribe", handleSubscribe);
app.get("/api/confirm", handleConfirm);

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
