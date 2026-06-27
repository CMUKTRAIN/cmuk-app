import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/coach", async (req, res) => {
  try {
    const { message, history } = req.body;
    const client = getGeminiClient();

    // Construct a rich prompt incorporating CMUK Culinary Medicine vision
    const systemPrompt = `You are the Culinary Medicine UK (CMUK) AI Food Coach for the "Fuel Your Future" app.
Your objective is to help learners (especially students) build and eat healthy, balanced, affordable, and sustainable meals.

Maintain a friendly, encouraging, compassionate, and informative tone. Make your suggestions:
1. Highly affordable (aiming for meals under £2, £3, or £5).
2. Sourced around the Healthy Plate Healthy Planet framework (prioritizing seasonal vegetables, whole grains, and sustainable protein sources, with ideas for healthy swaps).
3. Simple and quick (perfect for student kitchens, e.g. 10-15 minute recipes, one-pot ideas).
4. Truthful and science-backed, busting common nutrition myths when relevant.

If the user lists ingredients (e.g. "I have beans, eggs, and rice"), provide a recipe they can make using those ingredients plus common pantry essentials. Detail:
- Brand new Recipe Name (styled nicely)
- Estimated Prep/Cook Time
- Cost-per-serving estimate (in GBP)
- Easy step-by-step cooking instructions
- A brief explanation of how it aligns with the Healthy Plate Healthy Planet framework (Balance & Nutrition guidance)
- A "Sustainable Swap" or "Smart Tip" (e.g., how to reduce waste, replace a high-carbon item, or save money)

Always speak as a professional chef-dietician companion. Ensure your response is in clean, beautifully formatted Markdown so it renders elegantly in the app. Avoid dry academic jargon, use humble positive styling.`;

    // Format chat history for Gemini
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message || "Hello!" }],
    });

    const result = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Error in AI Food Coach API:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Food Coach." });
  }
});

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
