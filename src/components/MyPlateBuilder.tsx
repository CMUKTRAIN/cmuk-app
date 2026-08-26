import { useState, useEffect } from "react";
import { Ingredient, Category } from "../types";
import { INITIAL_INGREDIENTS } from "../data";
import { Carrot, Wheat, Leaf, Egg, Droplet, Sparkles, AlertCircle, Trash2, Heart, Plus, CheckCircle, Info, Star, Droplets, Activity } from "lucide-react";

interface SavedPlate {
  id: string;
  name: string;
  ingredients: Ingredient[];
  cost: number;
  co2: number;
  date: string;
}

export function MyPlateBuilder() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [plateName, setPlateName] = useState("");
  const [savedPlates, setSavedPlates] = useState<SavedPlate[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | "all">("all");
  const [activeSwap, setActiveSwap] = useState<{ ingredientId: string; with: string; benefit: string; savings: number; co2Savings: number } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("cmuk_saved_plates");
    if (data) {
      try {
        setSavedPlates(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const savePlatesToStorage = (newPlates: SavedPlate[]) => {
    localStorage.setItem("cmuk_saved_plates", JSON.stringify(newPlates));
    setSavedPlates(newPlates);
  };

  useEffect(() => {
    const swapable = selectedIngredients.find((ing) => ing.swaps);
    if (swapable && swapable.swaps) {
      setActiveSwap({
        ingredientId: swapable.id,
        ...swapable.swaps,
      });
    } else {
      setActiveSwap(null);
    }
  }, [selectedIngredients]);

  const toggleIngredient = (ing: Ingredient) => {
    if (selectedIngredients.some((i) => i.id === ing.id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i.id !== ing.id));
    } else {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
  };

  const clearPlate = () => {
    setSelectedIngredients([]);
    setPlateName("");
  };

  const handleApplySwap = () => {
    if (!activeSwap) return;
    const swapTarget = INITIAL_INGREDIENTS.find((i) => i.name === activeSwap.with);
    if (swapTarget) {
      const filtered = selectedIngredients.filter((i) => i.id !== activeSwap.ingredientId);
      if (!filtered.some((i) => i.id === swapTarget.id)) {
        setSelectedIngredients([...filtered, swapTarget]);
      } else {
        setSelectedIngredients(filtered);
      }
    }
    setActiveSwap(null);
  };

  const totalCost = selectedIngredients.reduce((sum, i) => sum + i.cost, 0);
  const totalCO2 = selectedIngredients.reduce((sum, i) => sum + i.co2, 0);

  const categoryCounts = selectedIngredients.reduce((acc, ing) => {
    acc[ing.category] = (acc[ing.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const vegCount = categoryCounts.fruit_veg || 0;
  const grainCount = categoryCounts.wholegrain || 0;
  const proteinCount = categoryCounts.protein || 0;
  const dairyCount = categoryCounts.dairy || 0;
  const fatsCount = categoryCounts.fats || 0;

  const totalItems = selectedIngredients.length;

  const calculateScore = () => {
    if (totalItems === 0) {
      return { stars: 0, feedback: "Start building your plate", color: "text-slate-400", status: "Empty Plate" };
    }

    let score = 0;
    const hasVeg = vegCount > 0;
    const hasGrain = grainCount > 0;
    const hasProtein = proteinCount > 0;
    const hasHealthyFats = fatsCount > 0;

    if (hasVeg && hasGrain && hasProtein) {
      score += 3;
      if (hasHealthyFats) score += 0.5;
      if (vegCount >= grainCount && vegCount >= proteinCount) score += 0.5;
    } else if ((hasVeg && hasGrain) || (hasVeg && hasProtein) || (hasGrain && hasProtein)) {
      score += 2;
    } else if (hasVeg || hasGrain || hasProtein) {
      score += 1;
    }

    let stars = 0;
    let feedback = "";
    let color = "text-slate-400";
    let status = "Needs Work";

    if (score >= 4.5) {
      stars = 5;
      feedback = "Perfect! A model of balanced nutrition.";
      color = "text-emerald-700";
      status = "⭐️⭐️⭐️⭐️⭐️ Perfect!";
    } else if (score >= 3.5) {
      stars = 4;
      feedback = "Excellent! A very well-balanced plate.";
      color = "text-emerald-600";
      status = "⭐️⭐️⭐️⭐️ Excellent!";
    } else if (score >= 2.5) {
      stars = 3;
      feedback = "Good foundation. Add more vegetables and fruits.";
      color = "text-blue-600";
      status = "⭐️⭐️⭐️ Good Start";
    } else if (score >= 1.5) {
      stars = 2;
      feedback = "Add whole grains and protein for balance.";
      color = "text-amber-600";
      status = "⭐️⭐️ Needs Variety";
    } else if (score >= 0.5) {
      stars = 1;
      feedback = "Build around vegetables, grains, and proteins.";
      color = "text-orange-600";
      status = "⭐️ Incomplete";
    } else {
      feedback = "Add ingredients to build your plate.";
      status = "Empty Plate";
    }

    return { stars, feedback, color, status };
  };

  const { stars, feedback, color: scoreColor, status: scoreStatus } = calculateScore();

  let balanceStatus = "Empty Plate";
  let balanceMessage = "Select healthy, sustainable ingredients below to start building your Balanced Plate!";
  let balanceColor = "text-slate-500 border-slate-200 bg-slate-50";

  if (totalItems > 0) {
    const counts = [vegCount > 0, grainCount > 0, proteinCount > 0];
    const essentialCategoriesPresent = counts.filter(Boolean).length;

    if (essentialCategoriesPresent === 1) {
      balanceStatus = "Single Group Focus";
      balanceMessage = "Add ingredients from other groups to balance your nutrients.";
      balanceColor = "text-amber-700 border-amber-200 bg-amber-50";
    } else if (essentialCategoriesPresent === 2) {
      balanceStatus = "A Good Start";
      const missingGroup = vegCount === 0 ? "Fruit & Veg" : grainCount === 0 ? "Wholegrains" : "Proteins";
      balanceMessage = `Add a source of ${missingGroup} to finish the balance.`;
      balanceColor = "text-blue-700 border-blue-200 bg-blue-50";
    } else {
      balanceStatus = "Well Balanced Plate!";
      balanceColor = "text-emerald-700 border-emerald-200 bg-emerald-50";
      balanceMessage = "You have Fruit & Veg, Wholegrains, and Proteins together. Excellent!";

      if (vegCount >= grainCount + proteinCount) {
        balanceStatus = "Perfectly Balanced Plate!";
        balanceColor = "text-emerald-800 border-emerald-300 bg-emerald-100";
        balanceMessage = "At least half your items are Fruits & Veg - perfectly matching the Harvard model!";
      }
    }
  }

  const handleSavePlate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIngredients.length === 0) return;
    const nameToSave = plateName.trim() || `My Plate (${selectedIngredients.map(i => i.name.split(' ')[0]).join(' & ')})`;
    const newPlate: SavedPlate = {
      id: "plate-" + Date.now(),
      name: nameToSave,
      ingredients: [...selectedIngredients],
      cost: totalCost,
      co2: totalCO2,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };

    const updatedPlates = [newPlate, ...savedPlates];
    savePlatesToStorage(updatedPlates);
    setPlateName("");
  };

  const handleDeleteSavedPlate = (id: string) => {
    const updated = savedPlates.filter((p) => p.id !== id);
    savePlatesToStorage(updated);
  };

  const categoryStyles: Record<Category, { border: string; bg: string; text: string; icon: any; label: string }> = {
    fruit_veg: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", icon: Carrot, label: "Veg & Fruit" },
    wholegrain: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-800", icon: Wheat, label: "Whole Grains" },
    protein: { border: "border-red-300", bg: "bg-red-50", text: "text-red-700", icon: Egg, label: "Healthy Protein" },
    dairy: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", icon: Leaf, label: "Dairy & Alts" },
    fats: { border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700", icon: Droplet, label: "Healthy Oils" },
  };

  return (
    <div className="space-y-8" id="plate-builder-section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-orange animate-pulse" /> Build My Plate
        </h2>
        <p className="text-slate-600 text-sm">
          Put the <span className="font-semibold text-brand-green">Healthy Plate Healthy Planet</span> science into practice. Build affordable, low-carbon meals visually and learn where to make sustainable swaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Harvard Plate - ROUND */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Plate Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800">HARVARD-STYLE HEALTHY PLATE</span>
              <button
                onClick={clearPlate}
                disabled={selectedIngredients.length === 0}
                className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Plate
              </button>
            </div>

            {/* The Plate - ROUND with correct Harvard colors */}
            <div className="relative max-w-xl mx-auto">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-slate-300 shadow-lg">
                {/* Vegetables & Fruits - Top Half (50%) - BOLD GREEN */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#4CAF50] flex flex-wrap items-start justify-center p-4 pt-6 gap-1.5 overflow-y-auto">
                  <div className="absolute top-2 left-3 text-[9px] font-bold text-white uppercase tracking-wider">Vegetables & Fruits</div>
                  <div className="absolute top-2 right-3 text-[9px] font-medium text-white/80">(50%)</div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 w-full">
                    {selectedIngredients.filter(i => i.category === 'fruit_veg').map(ing => (
                      <span key={ing.id} className="text-[10px] bg-white/90 text-slate-800 px-2 py-0.5 rounded-full shadow-sm border border-white/50 font-medium">
                        {ing.name}
                      </span>
                    ))}
                    {vegCount === 0 && (
                      <span className="text-xs text-white/70 italic">Add vegetables & fruits here</span>
                    )}
                  </div>
                </div>

                {/* Bottom Left - Whole Grains (25%) - BOLD AMBER/GOLDEN */}
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#D4A017] flex flex-wrap items-start justify-center p-4 pt-6 gap-1.5 overflow-y-auto border-t-2 border-r-2 border-white/30">
                  <div className="absolute top-2 left-3 text-[9px] font-bold text-white uppercase tracking-wider">Whole Grains</div>
                  <div className="absolute top-2 right-3 text-[9px] font-medium text-white/80">(25%)</div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 w-full">
                    {selectedIngredients.filter(i => i.category === 'wholegrain').map(ing => (
                      <span key={ing.id} className="text-[10px] bg-white/90 text-slate-800 px-2 py-0.5 rounded-full shadow-sm border border-white/50 font-medium">
                        {ing.name}
                      </span>
                    ))}
                    {grainCount === 0 && (
                      <span className="text-xs text-white/70 italic">Add whole grains here</span>
                    )}
                  </div>
                </div>

                {/* Bottom Right - Healthy Protein (25%) - BOLD RED/PINK */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#E57373] flex flex-wrap items-start justify-center p-4 pt-6 gap-1.5 overflow-y-auto border-t-2 border-white/30">
                  <div className="absolute top-2 left-3 text-[9px] font-bold text-white uppercase tracking-wider">Healthy Protein</div>
                  <div className="absolute top-2 right-3 text-[9px] font-medium text-white/80">(25%)</div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 w-full">
                    {selectedIngredients.filter(i => i.category === 'protein').map(ing => (
                      <span key={ing.id} className="text-[10px] bg-white/90 text-slate-800 px-2 py-0.5 rounded-full shadow-sm border border-white/50 font-medium">
                        {ing.name}
                      </span>
                    ))}
                    {proteinCount === 0 && (
                      <span className="text-xs text-white/70 italic">Add protein here</span>
                    )}
                  </div>
                </div>

                {/* Healthy Oils Circle - BOLD YELLOW */}
                <div className="absolute bottom-3 right-3 w-[70px] h-[70px] rounded-full bg-[#F9A825] border-2 border-white shadow-md flex flex-col items-center justify-center">
                  <span className="text-[7px] font-bold text-white uppercase text-center leading-tight">Healthy Oils</span>
                  <div className="flex flex-wrap gap-0.5 justify-center mt-0.5 px-1">
                    {selectedIngredients.filter(i => i.category === 'fats').slice(0, 2).map(ing => (
                      <span key={ing.id} className="text-[7px] bg-white/80 px-1 py-0.5 rounded-full font-medium">{ing.name}</span>
                    ))}
                    {fatsCount === 0 && <span className="text-[6px] text-white/80">Add oils</span>}
                  </div>
                </div>

                {/* Water Drop */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-md border border-white">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-[7px] font-bold text-slate-700">WATER</span>
                </div>

                {/* Stay Active Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 shadow-lg border-2 border-white rounded-xl px-3 py-2 text-center pointer-events-none">
                  <Activity className="w-5 h-5 text-red-500 mx-auto" />
                  <span className="text-[9px] font-bold text-slate-700 block">STAY ACTIVE!</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">PLATE SCORE</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                  ))}
                </div>
              </div>
              <span className={`text-xs font-bold ${scoreColor}`}>{feedback}</span>
            </div>

            {/* Balance Check */}
            <div className={`mt-3 p-3 rounded-xl border ${balanceColor} text-xs`}>
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> Balance Check: {balanceStatus}
              </div>
              <p className="leading-relaxed opacity-90 mt-0.5">{balanceMessage}</p>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estimated Cost</span>
                <span className="text-lg font-extrabold text-slate-800">£{totalCost.toFixed(2)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Carbon Footprint</span>
                <span className="text-lg font-extrabold text-[#3b82f6]">{totalCO2.toFixed(2)}kg CO₂</span>
              </div>
            </div>

            {/* Swap Alert */}
            {activeSwap && (
              <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 flex items-start gap-3 text-xs">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-lg font-bold">♻️</div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-800">Sustainable Swap!</div>
                  <p className="text-slate-600">{activeSwap.benefit}</p>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-[#047857]">
                    <span>Save -£{activeSwap.savings.toFixed(2)}</span>
                    <span>Save -{activeSwap.co2Savings.toFixed(2)}kg CO₂</span>
                  </div>
                  <button
                    onClick={handleApplySwap}
                    className="mt-1 bg-brand-green hover:bg-[#112923] text-white font-bold py-1 px-2.5 rounded-lg text-[10px] transition cursor-pointer"
                  >
                    Apply Swap
                  </button>
                </div>
              </div>
            )}

            {/* Save Plate */}
            {selectedIngredients.length > 0 && (
              <form onSubmit={handleSavePlate} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Name your meal..."
                  value={plateName}
                  onChange={(e) => setPlateName(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-orange-650 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-white" /> Save Plate
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Ingredient Selection */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-extrabold text-brand-green text-sm flex items-center justify-between mb-4">
              <span>Choose Ingredients</span>
              <span className="text-xs text-slate-400 font-normal">{totalItems} selected</span>
            </h3>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1 mb-4">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("all")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  selectedCategoryFilter === "all"
                    ? "bg-brand-green text-white border-brand-green shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                All
              </button>
              {(Object.keys(categoryStyles) as Category[]).map((cat) => {
                const style = categoryStyles[cat];
                const active = selectedCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                      active ? "bg-brand-green text-white border-brand-green shadow-sm" : `${style.bg} ${style.text} ${style.border} hover:opacity-85`
                    }`}
                  >
                    {cat === "fruit_veg" ? "🥕" : cat === "wholegrain" ? "🌾" : cat === "protein" ? "🥚" : cat === "dairy" ? "🥛" : "💧"}
                    {cat.split("_")[0]}
                  </button>
                );
              })}
            </div>

            {/* Ingredient Grid */}
            <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto max-h-[400px] pr-1">
              {INITIAL_INGREDIENTS.filter(
                (ing) => selectedCategoryFilter === "all" || ing.category === selectedCategoryFilter
              ).map((ing) => {
                const style = categoryStyles[ing.category];
                const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                const IconComponent = style.icon;

                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-brand-green border-brand-green text-white shadow-sm ring-1 ring-brand-orange/50"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/10 text-white" : style.bg + " " + style.text}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{ing.name}</span>
                      {ing.swaps && !isSelected && (
                        <span className="text-[8px] bg-amber-100 text-amber-800 rounded font-semibold px-1.5 py-0.5">Swap</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-medium">
                      <span className={isSelected ? "text-slate-300" : "text-slate-500"}>£{ing.cost.toFixed(2)}</span>
                      <span className={isSelected ? "text-slate-400" : "text-blue-500"}>{ing.co2.toFixed(2)}kg</span>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-brand-orange" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Plates */}
      {savedPlates.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Heart className="w-3 h-3 text-red-500 fill-current" /> My Saved Creations ({savedPlates.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedPlates.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-slate-800 leading-tight">{p.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>{p.date}</span>
                    <span>•</span>
                    <span>£{p.cost.toFixed(2)}</span>
                    <span>•</span>
                    <span className="text-emerald-600">{p.co2.toFixed(2)}kg</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSavedPlate(p.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
