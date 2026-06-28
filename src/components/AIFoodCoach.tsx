import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Sparkles, Send, Loader2, ArrowRight, HelpCircle, ChefHat } from "lucide-react";
import Markdown from "react-markdown";

const SUGGESTED_PROMPTS = [
  "I've got beans, eggs and rice. What can I make?",
  "Recommend a vegan student lunch under £2",
  "How can I cut my meat budget sustainably?",
  "Bust the carbohydrate myth for me"
];

export function AIFoodCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add initial greeting from CMUK Coach
    setMessages([
      {
        id: "greet-1",
        role: "model",
        text: "Hello there! I'm your Culinary Medicine UK **AI Food Coach**. 👋\n\nI'm trained on our *Healthy Plate Healthy Planet* framework to help you cook fast, budget-friendly, and sustainable student meals.\n\nTell me what ingredients you have in your cupboard (e.g. *'I have beans, eggs, and rice'*), or ask me for a specialized recipe under £2, and I'll whip up complete instructions for you!",
        timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Map chat messages into backend history schema { role: 'user' | 'model', text: string }[]
      const history = messages
        .filter((m) => m.id !== "greet-1")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to reach AI Food Coach.");
      }

      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        role: "model",
        text: data.text || "I apologize, I didn't receive an answer. Let's try restructuring your question!",
        timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Full error:", err);
      // Show the actual error message
      const errorMsg: ChatMessage = {
        id: "msg-err-" + Date.now(),
        role: "model",
        text: `⚠️ **Error Details**\n\n${err.message || "Unknown error"}\n\nPlease check the console for more information.`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="ai-coach-section">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          🤖 AI Food Coach & Clinical Assistant
        </h2>
        <p className="text-slate-600 text-sm font-sans">
          Get real-time answers and custom recipe ideas trained on regional UK ingredient prices, waste reduction, and sustainable swaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Sugesstion Prompts panel (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-green font-extrabold text-sm">
              <ChefHat className="w-4 h-4 text-brand-orange" /> Suggested Starters
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Don't know what to ask? Press any of these clinical student prompts to see immediate balanced recipes:
            </p>

            <div className="flex flex-col gap-2 pt-1 text-left">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handleSendMessage(p)}
                  disabled={loading}
                  className="p-3.5 text-left bg-[#FAF9F6] border border-slate-200/70 hover:bg-[#FFF7ED] hover:border-brand-orange rounded-xl text-xs text-slate-700 hover:text-slate-900 font-bold transition flex justify-between items-center group disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="leading-snug pr-2">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-orange flex-shrink-0 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 text-[#112923] rounded-xl border border-emerald-100/60 text-[10.5px] leading-relaxed flex gap-2">
            <HelpCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              Our AI coach respects dietary boundaries like <strong>Vegetarian, Vegan, Halal, gluten-free</strong> or allergy indicators. Just state it in your chats!
            </div>
          </div>
        </div>

        {/* Right Side: Chat Dialog panel (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden text-left">
          {/* Active Header bar of coach */}
          <div className="bg-[#FAF9F6] p-4 border-b border-orange-100/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">
              👨‍🍳
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-brand-green block">Chef Tutors Chatbox</span>
              <span className="text-[9px] text-[#047857] font-bold flex items-center gap-0.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#047857] rounded-full animate-ping" /> Clinically Trained Coach Active
              </span>
            </div>
          </div>

          {/* Messages dialog stack */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {messages.map((m) => {
              const isModel = m.role === "model";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 max-w-[85%] ${isModel ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
                >
                  {/* Icon */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs ${isModel ? "bg-orange-100 text-brand-orange border border-orange-200" : "bg-brand-green text-white"}`}>
                    {isModel ? "🤖" : "👤"}
                  </div>

                  <div className="space-y-1 block max-w-full">
                    {/* Text card */}
                    <div className={`p-3.5 rounded-2xl text-xs font-sans shadow-sm leading-relaxed ${isModel ? "bg-white border border-slate-200/75 text-slate-800 rounded-tl-none font-sans" : "bg-brand-green text-white rounded-tr-none"}`}>
                      <div className="markdown-body space-y-2 prose prose-slate text-left max-w-none font-sans">
                        <Markdown>{m.text}</Markdown>
                      </div>
                    </div>
                    {/* Timestamp */}
                    <span className="text-[9px] text-slate-400 font-medium block px-1 text-right">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3 max-w-[85%] self-start">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-brand-orange border border-orange-200 flex items-center justify-center font-bold text-xs">
                  🤖
                </div>
                <div className="p-3.5 bg-white border border-slate-150 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2 font-sans">
                  <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />
                  <span>Chef Coach is planning a custom response for you...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form action input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about ingredients (e.g. 'I've got chickpeas, carrots & rice, what can I cook?')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-green bg-slate-50 focus:bg-white disabled:opacity-60 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-brand-orange hover:bg-orange-650 text-white font-bold p-2.5 rounded-xl transition flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
