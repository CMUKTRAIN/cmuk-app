import { useState } from "react";
import { ArrowUpDown, HelpCircle, AlertCircle, ShoppingCart, Info, TrendingUp, CheckCircle, Sparkles } from "lucide-react";

interface SeasonalItem {
  id: string;
  name: string;
  season: "Autumn/Winter" | "Spring/Summer";
  costApprox: string;
  benefits: string;
}

const SEASONAL_STAPLES: SeasonalItem[] = [
  { id: "s1", name: "Parsnips & Carrots", season: "Autumn/Winter", costApprox: "£0.60 per kg", benefits: "Sweet, highly fibrous, slow release carbohydrates. Perfect for comforting baking and roasting." },
  { id: "s2", name: "UK Apples & Pears", season: "Autumn/Winter", costApprox: "£0.25 each", benefits: "Zero air-miles, crunchy, packed with pectin fiber which regulates gut absorption." },
  { id: "s3", name: "Leeks & Cabbages", season: "Autumn/Winter", costApprox: "£0.95 each", benefits: "Vast micronutrient density; provides prebiotic fuel to promote healthy stomach microbiota." },
  { id: "s4", name: "Berry Fruits (Strawberries/Raspberries)", season: "Spring/Summer", costApprox: "£1.50 per tub", benefits: "Extremely high in longevity antioxidants (antocyanins) and vitamin C. Keeps brain sharp." },
  { id: "s5", name: "UK Tomatoes & Courgettes", season: "Spring/Summer", costApprox: "£1.10 per pack", benefits: "Rich in cell-protective lycopene. Adds deep sweetness to quick, fresh pasta sauces." },
  { id: "s6", name: "Spinach & Salad Greens", season: "Spring/Summer", costApprox: "£0.80 per bag", benefits: "Abundant water-soluble lutein, folic acid, and iron. Quick cooking base." }
];

interface BaseStaple {
  id: string;
  name: string;
  price: number;
  unit: string;
  tags: string[];
}

const BASKET_STAPLES: BaseStaple[] = [
  { id: "b1", name: "Red Split Lentils", price: 1.15, unit: "500g pack", tags: ["Protein Base", "Best Value"] },
  { id: "b2", name: "Porridge Oats", price: 0.85, unit: "1kg bag", tags: ["Breakfast", "High Fiber"] },
  { id: "b3", name: "Brown Basmati Rice", price: 1.45, unit: "1kg pack", tags: ["Wholegrain", "Pantry"] },
  { id: "b4", name: "Canned Tomato (4-pack)", price: 1.20, unit: "4x 400g cans", tags: ["Sauce Base", "Pantry"] },
  { id: "b5", name: "Mixed Frozen Vegetables", price: 1.10, unit: "1kg bag", tags: ["Zero Waste", "Veggies"] },
  { id: "b6", name: "Free-range Large Eggs", price: 1.95, unit: "6x pack", tags: ["Quick Protein", "B12"] },
  { id: "b7", name: "Canned Chickpeas", price: 0.40, unit: "400g can", tags: ["Plant Protein", "Quick"] }
];

export function ShopSmart() {
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [currentSeasonFilter, setCurrentSeasonFilter] = useState<"all" | "Autumn/Winter" | "Spring/Summer">("all");
  const [showFaq, setShowFaq] = useState<string | null>(null);
  const [copiedList, setCopiedList] = useState(false);

  // Takeout vs Scratch-cooking savings calculator
  const [mealsPerWeek, setMealsPerWeek] = useState(3);
  const costTakeaway = 9.50; // average London student takeaway
  const costScratch = 1.60; // average CMUK scratch recipe

  const weeklyTakeawayTotal = mealsPerWeek * costTakeaway;
  const weeklyScratchTotal = mealsPerWeek * costScratch;
  const weeklySavings = weeklyTakeawayTotal - weeklyScratchTotal;
  const yearlySavings = weeklySavings * 52;

  const handleAddToBasket = (id: string) => {
    setBasket(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveFromBasket = (id: string) => {
    setBasket(prev => {
      const copy = { ...prev };
      if (copy[id] <= 1) {
        delete copy[id];
      } else {
        copy[id] -= 1;
      }
      return copy;
    });
  };

  const clearBasket = () => setBasket({});

  const handleCopyBasketItems = () => {
    try {
      const text = Object.entries(basket)
        .map(([id, qty]) => `- ${qty}x ${BASKET_STAPLES.find((b) => b.id === id)?.name}`)
        .join("\n");
      navigator.clipboard.writeText(`My CMUK Smart Shop Basket:\n\n${text}`);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 3050);
    } catch (err) {
      console.warn("Could not copy:", err);
    }
  };

  const basketSubtotal = Object.entries(basket).reduce((sum, [id, qty]) => {
    const item = BASKET_STAPLES.find(b => b.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="space-y-8" id="shop-smart-section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          🛒 Shop Smart & Pantry Staple Budgets
        </h2>
        <p className="text-slate-600 text-sm">
          Fulfill your cooking potential without breaking your wallet. Master budget planning, seasonal buy guides, and witness the power of compounding savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Grid: Savings Calculator & FAQs (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Savings visual comparison */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-orange" /> Takeaway vs Scratch-Cooking Savings
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              London student takeaways average <strong className="text-slate-700">£9.50</strong> per serving. Cooking from-scratch with CMUK standards costs under <strong className="text-slate-700">£1.60</strong> per serving. Adjust your habits to see molecular yearly savings:
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-600 block flex justify-between">
                <span>Cooking at home instead of getting takeout:</span>
                <span className="text-brand-orange font-black text-xs">{mealsPerWeek} meals a week</span>
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={mealsPerWeek}
                onChange={(e) => setMealsPerWeek(Number(e.target.value))}
                className="w-full accent-brand-orange h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Visual comparison bars */}
            <div className="space-y-2.5 pt-3 font-sans">
              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Convenience Takeaway ({mealsPerWeek}x)</span>
                  <span>£{weeklyTakeawayTotal.toFixed(2)}</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-md transition-all duration-300"
                    style={{ width: `${(weeklyTakeawayTotal / (7 * costTakeaway)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>CMUK Home Cooking ({mealsPerWeek}x)</span>
                  <span className="text-brand-green font-extrabold">£{weeklyScratchTotal.toFixed(2)}</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-brand-green rounded-md transition-all duration-300"
                    style={{ width: `${(weeklyTakeawayTotal / (7 * costTakeaway)) * 100 * (costScratch / costTakeaway)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Savings projection card */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between text-xs gap-4 animate-fade-in text-left">
              <div className="space-y-1">
                <p className="font-bold text-[#112923]">Financial Wellbeing Boost!</p>
                <div className="text-slate-600 leading-relaxed">
                  Saving <strong className="text-brand-green">£{weeklySavings.toFixed(2)}</strong> per week pays back <strong className="text-[#112923] font-bold">£{yearlySavings.toFixed(2)}</strong> over a year!
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-brand-green tracking-tight whitespace-nowrap">+£{yearlySavings.toFixed(0)}</span>
                <span className="text-[10px] text-slate-450 block font-bold">Extra cash / yr</span>
              </div>
            </div>
          </div>

          {/* Seasonal uk lists */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-orange" /> Eat with the Seasons (UK Growers)
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[9px] font-bold">
                <button
                  type="button"
                  onClick={() => setCurrentSeasonFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${currentSeasonFilter === "all" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSeasonFilter("Autumn/Winter")}
                  className={`px-2 py-1 rounded-md transition flex items-center gap-0.5 cursor-pointer ${currentSeasonFilter === "Autumn/Winter" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  🍁 Autumn/Winter
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSeasonFilter("Spring/Summer")}
                  className={`px-2 py-1 rounded-md transition flex items-center gap-0.5 cursor-pointer ${currentSeasonFilter === "Spring/Summer" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  ☀️ Sun/Spring
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-left">
              UK produce tastes better, has higher micronutrient concentrations, and costs up to 50% less when purchased in its natural grow season. Plan your meals around:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1 text-left">
              {SEASONAL_STAPLES.filter(s => currentSeasonFilter === "all" || s.season === currentSeasonFilter).map(s => (
                <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/50 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-xs text-[#112923] leading-tight block">{s.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-brand-orange font-bold flex-shrink-0">
                        {s.season === "Autumn/Winter" ? "🍁" : "☀️"} {s.season.split("/")[0]}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">{s.benefits}</p>
                  </div>
                  <div className="text-[10px] font-black text-brand-green pt-1 border-t border-slate-100">
                    Est. Cost: {s.costApprox}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Grid: Interactive Shopping Planner (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-orange" /> Interactive Shopping Cart Planner
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add standard, high-benefit CMUK cupboard staples to your simulated basket to see the absolute minimal upfront cost of healthy eating.
              </p>

              {/* Basket list staples */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-left">
                {BASKET_STAPLES.map(b => {
                  const qty = basket[b.id] || 0;
                  return (
                    <div key={b.id} className="p-3 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 leading-none block">{b.name}</span>
                          <span className="text-[9px] text-slate-400 font-medium">({b.unit})</span>
                        </div>
                        <div className="flex gap-1.5 pt-0.5">
                          {b.tags.map(t => (
                            <span key={t} className="text-[9px] text-[#112923] font-bold bg-[#D1FAE5] px-1.5 py-0.2 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 font-mono">£{b.price.toFixed(2)}</span>
                        {qty > 0 ? (
                          <div className="flex items-center bg-brand-green text-white rounded-lg">
                            <button
                              onClick={() => handleRemoveFromBasket(b.id)}
                              className="px-2 py-1 font-extrabold hover:bg-[#112923] rounded-l-lg transition text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2.5 font-bold font-mono text-xs">{qty}</span>
                            <button
                              onClick={() => handleAddToBasket(b.id)}
                              className="px-2 py-1 font-extrabold hover:bg-[#112923] rounded-r-lg transition text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToBasket(b.id)}
                            className="bg-brand-orange hover:bg-orange-650 text-white font-black py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart summary */}
            <div className="pt-5 border-t border-slate-100 flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-600 block">Total Basket Price</span>
                  <span className="text-slate-400 text-[10px] font-medium">Prepares multiple nutritious meals</span>
                </div>
                <span className="text-2xl font-black text-brand-green font-mono">£{basketSubtotal.toFixed(2)}</span>
              </div>

              {basketSubtotal > 0 ? (
                <div className="space-y-2.5">
                  <div className="p-3 bg-orange-50/60 text-slate-700 rounded-xl border border-orange-100 text-[11px] leading-relaxed flex gap-2">
                    <Info className="w-4.5 h-4.5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div>
                      These cupboard essentials form the base of over <strong className="text-brand-orange font-bold">10 high-protein meals</strong>. Stocking these reduces long-term food waste and keeps single portion costs under £0.80!
                    </div>
                  </div>

                  {copiedList && (
                    <div className="p-2 text-center bg-brand-green text-white text-[11px] font-extrabold rounded-xl animate-fade-in">
                      ✓ Shopping list elements copied to clipboard!
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={clearBasket}
                      className="border border-slate-200 hover:border-slate-300 text-slate-500 font-bold px-4 py-2 rounded-xl text-xs flex-1 transition cursor-pointer"
                    >
                      Clear Basket
                    </button>
                    <button
                      onClick={handleCopyBasketItems}
                      className="bg-brand-green hover:bg-[#112923] text-white font-bold px-4 py-2 rounded-xl text-xs flex-1 text-center transition cursor-pointer"
                    >
                      Copy Basket Items
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                  Your basket card is empty. Add pantry items above to forecast expenses.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
