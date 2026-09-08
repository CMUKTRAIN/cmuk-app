import { useState } from "react";
import { NUTRITION_MYTHS } from "../data";
import { Sparkles, HelpCircle, AlertTriangle, CheckCircle, ShieldAlert, BookOpen } from "lucide-react";

export function MythBusterSection() {
  const [bustedList, setBustedList] = useState<string[]>([]);
  const [activeFlippedCard, setActiveFlippedCard] = useState<string | null>(null);

  const toggleExposed = (id: string) => {
    setActiveFlippedCard(activeFlippedCard === id ? null : id);
    if (!bustedList.includes(id)) {
      setBustedList([...bustedList, id]);
    }
  };

  return (
    <div className="space-y-8" id="myth-buster-section">
      {/* Visual Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          🧠 Nutrition Myth Buster
        </h2>
        <p className="text-slate-600 text-sm">
          With social media full of trending wellness accounts, separating facts from fiction can be stressful. Let's bust common nutritional myths with clinical evidence!
        </p>
      </div>

      {/* Grid of Myths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NUTRITION_MYTHS.map((m) => {
          const isFlipped = activeFlippedCard === m.id;
          const wasBustedAlready = bustedList.includes(m.id);

          return (
            <div
              key={m.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isFlipped
                  ? "bg-brand-green border-brand-green shadow-md text-white ring-1 ring-brand-orange/40"
                  : "bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm text-slate-700 hover:shadow"
              }`}
            >
              {/* Card Header & Question */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                    isFlipped ? "bg-[#D1FAE5] text-[#047857]" : "bg-red-55 text-[#DC2626] border border-red-100"
                  }`}>
                    {isFlipped ? "✅ Clinically Verified" : "⚠️ Misinformation Alert"}
                  </span>
                  {wasBustedAlready && !isFlipped && (
                    <span className="text-[10px] text-[#047857] font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3.5 h-3.5 fill-current text-white border border-emerald-600 rounded-full" /> Busted
                    </span>
                  )}
                </div>

                <h3 className={`font-extrabold text-sm sm:text-base leading-snug ${isFlipped ? "text-emerald-300" : "text-slate-800"}`}>
                  {m.title}
                </h3>

                {/* Primary Content Block depending on state */}
                {!isFlipped ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> COMMON SENSE MYTH:
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                      "{m.myth}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 animate-fade-in text-xs leading-relaxed">
                    <div className="space-y-1">
                      <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 tracking-wider uppercase">
                        🔬 The Nutrition Science:
                      </p>
                      <p className="text-slate-200 font-medium font-sans">
                        {m.fact}
                      </p>
                    </div>

                    <div className="space-y-1 p-3 bg-[#112923] rounded-xl border border-[#ffffff10] text-slate-300">
                      <p className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">
                        💡 STUDENT TIP FOR SUCCESS:
                      </p>
                      <p className="font-sans text-[11px] leading-relaxed">
                        {m.customTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className={`p-4 border-t text-right flex justify-between items-center ${isFlipped ? "border-emerald-800/20 bg-[#112923]/40" : "border-slate-100 bg-slate-50/50"}`}>
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {isFlipped ? "Need a reminder of the myth?" : "Curious if this is true?"}
                </span>
                <button
                  onClick={() => toggleExposed(m.id)}
                  className={`font-black py-1.5 px-4 rounded-xl text-xs transition duration-200 cursor-pointer ${
                    isFlipped
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-brand-orange hover:bg-orange-650 text-white"
                  }`}
                >
                  {isFlipped ? "Show Myth" : "Expose Fact 🔬"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Warning Card */}
      <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-3.5 max-w-3xl mx-auto text-xs">
        <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 font-sans block">Culinary Medicine UK Standard</span>
          <p className="text-slate-600 leading-relaxed">
            CMUK combines clinical nutrition with clinical chef instructions. These guidelines align with the latest peer-reviewed health research from public health bodies and the NHS, rather than food sponsor brands or influencer endorsements.
          </p>
        </div>
      </div>
    </div>
  );
}
