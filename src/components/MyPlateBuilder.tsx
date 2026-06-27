import { useState, useEffect } from "react";
import { Ingredient, Category } from "../types";
import { INITIAL_INGREDIENTS } from "../data";
import { Carrot, Wheat, Leaf, Egg, Droplet, Sparkles, AlertCircle, Trash2, Heart, Plus, CheckCircle, Info } from "lucide-react";

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

  // Load saved plates from localStorage
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

  // Check for sustainable swap suggestions
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
      // Prevent duplicating same exact ingredient item
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
      // Ensure we don't add duplicate
      if (!filtered.some((i) => i.id === swapTarget.id)) {
        setSelectedIngredients([...filtered, swapTarget]);
      } else {
        setSelectedIngredients(filtered);
      }
    }
    setActiveSwap(null);
  };

  // Calculations
  const totalCost = selectedIngredients.reduce((sum, i) => sum + i.cost, 0);
  const totalCO2 = selectedIngredients.reduce((sum, i) => sum + i.co2, 0);

  // Category proportions inside selected
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

  // Diet balance diagnosis
  let balanceScore = 0;
  let balanceStatus = "Empty Plate";
  let balanceMessage = "Select healthy, sustainable ingredients below to start building your Balanced Plate!";
  let balanceColor = "text-slate-500 border-slate-200 bg-slate-50";

  if (totalItems > 0) {
    // We want roughly 50% fruit/veg, 25% wholegrain, 25% protein as ideal.
    const counts = [vegCount > 0, grainCount > 0, proteinCount > 0];
    const essentialCategoriesPresent = counts.filter(Boolean).length;

    if (essentialCategoriesPresent === 1) {
      balanceStatus = "Single Group Focus";
      balanceMessage = "Your plate is focused on one group. Add ingredients from other groups to balance your nutrients.";
      balanceColor = "text-amber-700 border-amber-200 bg-amber-50";
      balanceScore = 30;
    } else if (essentialCategoriesPresent === 2) {
      balanceStatus = "A Good Start";
      const missingGroup = vegCount === 0 ? "Fruit & Veg" : grainCount === 0 ? "Wholegrains" : "Proteins";
      balanceMessage = `Nice! You've got two essential components. Try adding a source of ${missingGroup} to finish the balance.`;
      balanceColor = "text-blue-700 border-blue-200 bg-blue-50";
      balanceScore = 65;
    } else {
      // 3 essential groups present
      balanceScore = 80;
      balanceStatus = "Well Balanced Plate!";
      balanceColor = "text-emerald-700 border-emerald-200 bg-emerald-50";
      balanceMessage = "Awesome! You have Fruit & Veg, Wholegrains, and Proteins together. An excellent sustained-energy combination.";

      // Check if Veg is the primary proportion
      if (vegCount >= grainCount + proteinCount) {
        balanceScore = 100;
        balanceStatus = "Perfectly Balanced Plate!";
        balanceColor = "text-emerald-800 border-emerald-300 bg-emerald-100";
        balanceMessage = "Highly Commended! At least half your items are Fruits & Veg, beautifully matching our Healthy Plate Healthy Planet standards.";
      } else {
        balanceMessage += " Hint: For maximum health and lower footprint, aim for Veg and Fruit to make up half the plate!";
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
    // Award mini local triggers if needed, but keeping it robust.
  };

  const handleDeleteSavedPlate = (id: string) => {
    const updated = savedPlates.filter((p) => p.id !== id);
    savePlatesToStorage(updated);
  };

  // Helper colors
  const categoryStyles: Record<Category, { border: string; bg: string; text: string; icon: any; label: string }> = {
    fruit_veg: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", icon: Carrot, label: "Veg & Fruit (50%)" },
    wholegrain: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-800", icon: Wheat, label: "Wholegrains (25%)" },
    protein: { border: "border-red-300", bg: "bg-red-50", text: "text-red-700", icon: Egg, label: "Protein (25%)" },
    dairy: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", icon: Leaf, label: "Dairy & Alts" },
    fats: { border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700", icon: Droplet, label: "Healthy Fats" },
  };

  return (
    <div className="space-y-8" id="plate-builder-section">
      {/* Visual Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-orange animate-pulse" /> Build My Plate
        </h2>
        <p className="text-slate-600 text-sm">
          Put the <span className="font-semibold text-brand-green">Healthy Plate Healthy Planet</span> science into practice. Build affordable, low-carbon meals visually and learn where to make sustainable swaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Plate Display */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interactive Layout</span>
              <button
                onClick={clearPlate}
                disabled={selectedIngredients.length === 0}
                className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Plate
              </button>
            </div>

            {/* Visual Plate Graphic */}
            <div className="relative flex justify-center py-6">
              {/* Main Outer Rim */}
              <div className="w-72 h-72 rounded-full border-8 border-slate-100 bg-white shadow-md relative flex items-center justify-center overflow-hidden">
                {selectedIngredients.length === 0 ? (
                  <div className="text-center p-6 space-y-2 z-10">
                    <p className="text-slate-300 text-4xl">🍽️</p>
                    <p className="text-xs text-slate-400 font-medium">Your plate is empty.</p>
                    <p className="text-[10px] text-slate-300">Choose cheap, high-nutrition staples below!</p>
                  </div>
                ) : (
                  <>
                    {/* Background sectors to represent standard proportions */}
                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                      {/* Fruit & Veg Sector - 50% (Semicircle) */}
                      <path d="M 50,50 L 50,0 A 50,50 0 1,1 50,100 Z" fill="#ecfdf5" opacity="0.8" />
                      {/* Wholegrains Sector - 25% (Quarter circle) */}
                      <path d="M 50,50 L 50,100 A 50,50 0 0,1 0,50 Z" fill="#fffbeb" opacity="0.8" />
                      {/* Protein Sector - 25% (Quarter circle) */}
                      <path d="M 50,50 L 0,50 A 50,50 0 0,1 50,0 Z" fill="#fef2f2" opacity="0.8" />
                    </svg>

            {/* Central Balance Tag */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <div className="bg-white/95 shadow-sm border border-orange-100 rounded-lg p-2 max-w-[12rem] text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Health Balance</span>
                <span className={`text-xs font-bold block ${vegCount > 0 && grainCount > 0 && proteinCount > 0 ? "text-brand-green" : "text-brand-orange"}`}>
                  {balanceStatus}
                </span>
              </div>
            </div>

                    {/* Rendered Ingredients scattered organically inside sectors */}
                    <div className="absolute inset-4 rounded-full pointer-events-none flex flex-wrap items-center justify-center gap-1.5 p-4 z-20">
                      {selectedIngredients.map((ing) => {
                        const style = categoryStyles[ing.category];
                        return (
                          <div
                            key={ing.id}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${style.border} ${style.bg} ${style.text} shadow-sm animate-fade-in flex items-center gap-1`}
                          >
                            <span className="text-xs">{ing.category === "fruit_veg" ? "🥕" : ing.category === "wholegrain" ? "🌾" : ing.category === "protein" ? "🥚" : ing.category === "dairy" ? "🥛" : "💧"}</span>
                            {ing.name}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Sub-dishes overlaying (e.g. Dairy / healthy fats circle) */}
                <div className="absolute bottom-1 right-1 w-16 h-16 rounded-full border-4 border-slate-100 bg-blue-50/90 shadow flex flex-col items-center justify-center text-center z-30">
                  <span className="text-[8px] font-bold text-blue-500 uppercase">Dairy / Alt</span>
                  <span className="text-[10px] font-bold text-blue-800">{dairyCount} items</span>
                </div>
                <div className="absolute top-1 right-1 w-16 h-16 rounded-full border-4 border-slate-100 bg-yellow-50/90 shadow flex flex-col items-center justify-center text-center z-30">
                  <span className="text-[8px] font-bold text-yellow-600 uppercase">Healthy Fats</span>
                  <span className="text-[10px] font-bold text-yellow-800">{fatsCount} items</span>
                </div>
              </div>
            </div>

            {/* Live Diagnosis Banner */}
            <div className={`p-4 rounded-xl border ${balanceColor} space-y-1 text-xs transition-all duration-300`}>
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> Balance Check: {balanceStatus}
              </div>
              <p className="leading-relaxed opacity-90">{balanceMessage}</p>
            </div>
          </div>

          {/* Quick Metrics & Swap recommendations */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            {/* Price & Eco Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estimated Cost</span>
                <span className="text-xl font-extrabold text-slate-800">£{totalCost.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">per single serving</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Carbon Footprint</span>
                <span className="text-xl font-extrabold text-[#3b82f6]">
                  {totalCO2.toFixed(2)} <span className="text-xs font-normal">kg CO₂</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-medium block">
                  {totalCO2 < 0.4 ? "🌱 Ultra Eco-friendly!" : "🥦 Low-impact meal"}
                </span>
              </div>
            </div>

            {/* Active Sustainable Swap Alert */}
            {activeSwap && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 flex items-start gap-3 animate-fade-in text-xs">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-lg font-bold">♻️</div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-800">Sustainable Swap Highlight!</div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeSwap.benefit}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[10px] font-semibold text-[#047857]">
                    <span>Cuts Cost: -£{activeSwap.savings.toFixed(2)}</span>
                    <span>CO₂ Saved: -{activeSwap.co2Savings.toFixed(2)} kg</span>
                  </div>
                  <button
                    onClick={handleApplySwap}
                    className="mt-2 bg-brand-green hover:bg-[#112923] text-white font-bold py-1 px-2.5 rounded-lg text-[10px] transition cursor-pointer"
                  >
                    Apply Swaps
                  </button>
                </div>
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <form onSubmit={handleSavePlate} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Give your meal a name..."
                  value={plateName}
                  onChange={(e) => setPlateName(e.target.value)}
                  className="flex-1 text-xs border border-orange-200/40 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
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

        {/* Right Side: Ingredient Selection Grid */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-brand-green text-sm flex items-center justify-between">
              <span>Choose Ingredients</span>
              <span className="text-xs text-slate-400 font-normal">{totalItems} active</span>
            </h3>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-1">
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
                    {cat === "fruit_veg" ? "🥕" : cat === "wholegrain" ? "🌾" : cat === "protein" ? "🥚" : cat === "dairy" ? "🥛" : "💧"}{" "}
                    {cat.split("_")[0]}
                  </button>
                );
              })}
            </div>

            {/* List of ingredients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
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
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1 relative cursor-pointer ${
                      isSelected
                        ? "bg-brand-green border-brand-green text-white shadow-sm ring-1 ring-brand-orange/50"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded-lg ${isSelected ? "bg-white/10 text-white" : style.bg + " " + style.text}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold leading-tight">{ing.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-brand-orange absolute top-2 right-2 fill-brand-green" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5" />
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-100/50 text-[10px] font-medium">
                      <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                        Cost: <strong className={isSelected ? "text-white" : "text-slate-900"}>£{ing.cost.toFixed(2)}</strong>
                      </span>
                      <span className={isSelected ? "text-slate-400" : "text-blue-500"}>
                        Carbon: <strong>{ing.co2.toFixed(2)}kg</strong>
                      </span>
                    </div>

                    {ing.swaps && !isSelected && (
                      <span className="text-[8px] bg-amber-100 text-amber-800 rounded font-semibold px-1 py-0.2 mt-1 self-start flex items-center gap-0.5">
                        <Info className="w-2 h-2" /> Swap Idea
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Plate History Shelf */}
          {savedPlates.length > 0 && (
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-red-500 fill-current" /> My Saved Creations ({savedPlates.length})
              </h4>
              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                {savedPlates.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs animate-fade-in"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="font-bold text-slate-800 leading-tight">{p.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3">
                        <span>{p.date}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">£{p.cost.toFixed(2)}</span>
                        <span>•</span>
                        <span className="font-medium text-emerald-600">{p.co2.toFixed(2)}kg CO₂</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSavedPlate(p.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                      title="Delete Plate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
