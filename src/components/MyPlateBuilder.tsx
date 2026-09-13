import { useState, useEffect } from "react";
import { Ingredient, Category } from "../types";
import { INITIAL_INGREDIENTS } from "../data";
import { 
  Carrot, Wheat, Leaf, Egg, Droplet, Sparkles, AlertCircle, Trash2, 
  Heart, Plus, CheckCircle, Info, Star
} from "lucide-react";

interface SavedPlate {
  id: string;
  name: string;
  ingredients: Ingredient[];
  cost: number;
  co2: number;
  date: string;
}

// Category names with display labels
const categoryLabels: Record<Category, string> = {
  fruit_veg: "Fruit & Veg",
  wholegrain: "Whole Grains",
  protein: "Protein",
  dairy: "Dairy",
  fats: "Healthy Oils",
};

// Color palette
const COLORS = {
  green: "#2E7D32",
  amber: "#C68A00",
  red: "#C62828",
  yellow: "#F9A825",
};

// --- 5 PLATE OPTIONS ---
const PLATE_OPTIONS = [
  {
    id: "perfect",
    name: "Perfect Balance",
    description: "50% Veg, 25% Protein, 25% Grains",
    ingredients: [
      { id: "broccoli", name: "Broccoli", category: "fruit_veg" as Category, cost: 0.40, co2: 0.12 },
      { id: "carrots", name: "Carrots", category: "fruit_veg" as Category, cost: 0.12, co2: 0.05 },
      { id: "spinach", name: "Fresh Spinach", category: "fruit_veg" as Category, cost: 0.35, co2: 0.10 },
      { id: "brown-rice", name: "Brown Rice", category: "wholegrain" as Category, cost: 0.30, co2: 0.20 },
      { id: "eggs", name: "Free-range Eggs (2x)", category: "protein" as Category, cost: 0.55, co2: 0.30 },
      { id: "olive-oil", name: "Olive Oil (1 tbsp)", category: "fats" as Category, cost: 0.15, co2: 0.05 },
    ] as Ingredient[],
  },
  {
    id: "missing-grains",
    name: "Missing Grains",
    description: "50% Veg, 50% Protein, 0% Grains",
    ingredients: [
      { id: "broccoli", name: "Broccoli", category: "fruit_veg" as Category, cost: 0.40, co2: 0.12 },
      { id: "carrots", name: "Carrots", category: "fruit_veg" as Category, cost: 0.12, co2: 0.05 },
      { id: "spinach", name: "Fresh Spinach", category: "fruit_veg" as Category, cost: 0.35, co2: 0.10 },
      { id: "eggs", name: "Free-range Eggs (2x)", category: "protein" as Category, cost: 0.55, co2: 0.30 },
      { id: "tuna", name: "Canned Tuna", category: "protein" as Category, cost: 0.50, co2: 0.40 },
      { id: "olive-oil", name: "Olive Oil (1 tbsp)", category: "fats" as Category, cost: 0.15, co2: 0.05 },
    ] as Ingredient[],
  },
  {
    id: "missing-protein",
    name: "Missing Protein",
    description: "50% Veg, 0% Protein, 50% Grains",
    ingredients: [
      { id: "broccoli", name: "Broccoli", category: "fruit_veg" as Category, cost: 0.40, co2: 0.12 },
      { id: "carrots", name: "Carrots", category: "fruit_veg" as Category, cost: 0.12, co2: 0.05 },
      { id: "spinach", name: "Fresh Spinach", category: "fruit_veg" as Category, cost: 0.35, co2: 0.10 },
      { id: "brown-rice", name: "Brown Rice", category: "wholegrain" as Category, cost: 0.30, co2: 0.20 },
      { id: "sweet-potato", name: "Sweet Potato", category: "wholegrain" as Category, cost: 0.30, co2: 0.15 },
      { id: "olive-oil", name: "Olive Oil (1 tbsp)", category: "fats" as Category, cost: 0.15, co2: 0.05 },
    ] as Ingredient[],
  },
  {
    id: "veg-heavy",
    name: "Veg Heavy",
    description: "75% Veg, 12.5% Protein, 12.5% Grains",
    ingredients: [
      { id: "broccoli", name: "Broccoli", category: "fruit_veg" as Category, cost: 0.40, co2: 0.12 },
      { id: "carrots", name: "Carrots", category: "fruit_veg" as Category, cost: 0.12, co2: 0.05 },
      { id: "spinach", name: "Fresh Spinach", category: "fruit_veg" as Category, cost: 0.35, co2: 0.10 },
      { id: "peas", name: "Frozen Peas", category: "fruit_veg" as Category, cost: 0.15, co2: 0.08 },
      { id: "sweetcorn", name: "Canned Sweetcorn", category: "fruit_veg" as Category, cost: 0.22, co2: 0.11 },
      { id: "eggs", name: "Free-range Eggs (1x)", category: "protein" as Category, cost: 0.28, co2: 0.15 },
      { id: "brown-rice", name: "Brown Rice", category: "wholegrain" as Category, cost: 0.30, co2: 0.20 },
      { id: "olive-oil", name: "Olive Oil (1 tbsp)", category: "fats" as Category, cost: 0.15, co2: 0.05 },
    ] as Ingredient[],
  },
  {
    id: "unhealthy",
    name: "Unbalanced",
    description: "Deceptively-tagged items, no real balance",
    ingredients: [
      { id: "chips", name: "Potato Chips", category: "wholegrain" as Category, cost: 0.40, co2: 0.30, isMisleading: true },
      { id: "fish-sticks", name: "Fish Sticks", category: "protein" as Category, cost: 0.50, co2: 0.60, isMisleading: true },
      { id: "soda", name: "Fizzy Drink", category: "dairy" as Category, cost: 0.35, co2: 0.15, isMisleading: true },
      { id: "crisps", name: "Crisps", category: "protein" as Category, cost: 0.30, co2: 0.20, isMisleading: true },
    ] as Ingredient[],
  },
];

export function MyPlateBuilder() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [plateName, setPlateName] = useState("");
  const [savedPlates, setSavedPlates] = useState<SavedPlate[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | "all">("all");
  const [activeSwap, setActiveSwap] = useState<{ ingredientId: string; with: string; benefit: string; savings: number; co2Savings: number } | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

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
    setShowFeedback(null);
  };

  const loadPlateOption = (option: typeof PLATE_OPTIONS[0]) => {
    setSelectedIngredients(option.ingredients);
    setShowFeedback(null);
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

  // Deceptively-tagged items don't count toward the legitimate category they're faking
  const categoryCounts = selectedIngredients.reduce((acc, ing) => {
    if (ing.isMisleading) return acc;
    acc[ing.category] = (acc[ing.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const vegCount = categoryCounts.fruit_veg || 0;
  const grainCount = categoryCounts.wholegrain || 0;
  const proteinCount = categoryCounts.protein || 0;
  const fatsCount = categoryCounts.fats || 0;
  const misleadingCount = selectedIngredients.filter((ing) => ing.isMisleading).length;
  const totalItems = selectedIngredients.length;

  // --- STAR RATING & FEEDBACK LOGIC ---
  const calculateScore = () => {
    if (totalItems === 0) {
      return { 
        stars: 0, 
        feedback: "Start building your plate", 
        color: "text-slate-400", 
        status: "Empty Plate",
        detailedFeedback: "Add ingredients from different food groups to build your plate."
      };
    }

    const hasVeg = vegCount > 0;
    const hasGrain = grainCount > 0;
    const hasProtein = proteinCount > 0;
    const hasMisleading = misleadingCount > 0;

    const vegRatio = totalItems > 0 ? vegCount / totalItems : 0;

    if (hasMisleading && !hasVeg && !hasGrain && !hasProtein) {
      return { 
        stars: 1, 
        feedback: "❌ Needs Redesign", 
        color: "text-red-600", 
        status: "⭐ Needs Redesign",
        detailedFeedback: "Look closely at what you've picked — not everything on this plate is as healthy as it looks. Try adding vegetables, whole grains, and protein for balance."
      };
    }

    let score = 0;
    let detailedFeedback = "";

    if (hasVeg && hasGrain && hasProtein) {
      score += 3;
      detailedFeedback = "✅ You have all three major food groups! ";
      
      if (vegRatio >= 0.4) {
        score += 1;
        detailedFeedback += "Great balance with plenty of vegetables. ";
      } else {
        detailedFeedback += "Try adding more vegetables to reach 50% of your plate. ";
      }
      
      if (fatsCount > 0) {
        score += 0.5;
        detailedFeedback += "✅ Healthy fats included. ";
      }
      
      if (vegRatio >= 0.5) {
        score += 0.5;
        detailedFeedback += "⭐ Perfect! Vegetables make up half your plate. ";
      }
      
    } else if ((hasVeg && hasGrain) || (hasVeg && hasProtein) || (hasGrain && hasProtein)) {
      score += 2;
      const missing = !hasVeg ? "Vegetables" : !hasGrain ? "Whole Grains" : "Protein";
      detailedFeedback = `✅ You have two food groups. Add ${missing} for a complete balanced plate. `;
      
      if (hasMisleading) {
        score -= 0.5;
        detailedFeedback += "⚠️ Double-check every item — some things aren't quite what they seem. ";
      }
      
    } else if (hasVeg || hasGrain || hasProtein) {
      score += 1;
      const missing = [];
      if (!hasVeg) missing.push("Vegetables");
      if (!hasGrain) missing.push("Whole Grains");
      if (!hasProtein) missing.push("Protein");
      detailedFeedback = `✅ You have one food group. Add ${missing.join(" and ")} to build a balanced plate. `;
    } else {
      detailedFeedback = "Add ingredients from different food groups to build your plate.";
    }

    if (hasMisleading && score > 0) {
      score -= 0.5;
      if (misleadingCount > vegCount + grainCount + proteinCount) {
        score -= 0.5;
        detailedFeedback += "⚠️ Look again at your choices — several may not be as healthy as their spot on the plate suggests.";
      } else {
        detailedFeedback += "💡 One or two of your picks might not be what they appear to be. Take another look.";
      }
    }

    let stars = 0;
    let status = "";
    let color = "text-slate-400";
    
    if (score >= 5) {
      stars = 5;
      status = "⭐⭐⭐⭐⭐ Gold Standard!";
      color = "text-emerald-700";
      detailedFeedback = "⭐ Perfect! A model of balanced nutrition with the right proportions.";
    } else if (score >= 4) {
      stars = 4;
      status = "⭐⭐⭐⭐ Strong Balance";
      color = "text-emerald-600";
    } else if (score >= 3) {
      stars = 3;
      status = "⭐⭐⭐ Needs Improvement";
      color = "text-blue-600";
    } else if (score >= 2) {
      stars = 2;
      status = "⭐⭐ Limited Balance";
      color = "text-amber-600";
    } else if (score >= 1) {
      stars = 1;
      status = "⭐ Needs Redesign";
      color = "text-orange-600";
    } else {
      stars = 0;
      status = "Empty Plate";
      color = "text-slate-400";
    }

    return { stars, feedback: status, color, status, detailedFeedback };
  };

  const { stars, feedback, color: scoreColor, detailedFeedback } = calculateScore();

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
        balanceMessage = "At least half your items are Fruits & Veg - perfectly matching the model!";
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
    fruit_veg: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", icon: Carrot, label: "Fruit & Veg" },
    wholegrain: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-800", icon: Wheat, label: "Whole Grains" },
    protein: { border: "border-red-300", bg: "bg-red-50", text: "text-red-700", icon: Egg, label: "Protein" },
    dairy: { border: "border-yellow-300", bg: "bg-yellow-50", text: "text-yellow-700", icon: Leaf, label: "Dairy" },
    fats: { border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700", icon: Droplet, label: "Healthy Oils" },
  };

  // --- RENDER PLATE (single unlabeled layout, no plate-style selector) ---
  const renderPlateSections = () => {
    return (
      <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-slate-300 shadow-lg">
        {/* Grains - TOP (25%) */}
        <div className="absolute top-0 left-0 w-full h-1/4 bg-[#C68A00] flex flex-wrap items-center justify-center p-2 overflow-y-auto border-b-2 border-white/40">
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[12px] font-bold text-white">Grains</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-8 w-full">
            {selectedIngredients.filter(i => i.category === 'wholegrain').map(ing => (
              <span key={ing.id} className="text-[10px] bg-white/70 text-slate-800 px-2 py-0.5 rounded-full font-medium">{ing.name}</span>
            ))}
            {grainCount === 0 && <span className="text-[9px] text-white/70">Add grains</span>}
          </div>
        </div>

        {/* Veg - BOTTOM LEFT (50%) */}
        <div className="absolute bottom-0 left-0 w-1/2 h-3/4 bg-[#2E7D32] flex flex-wrap items-center justify-center p-2 overflow-y-auto border-t-2 border-r-2 border-white/40">
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[12px] font-bold text-white">Veg & Fruits</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-8 w-full">
            {selectedIngredients.filter(i => i.category === 'fruit_veg').map(ing => (
              <span key={ing.id} className="text-[10px] bg-white/70 text-slate-800 px-2 py-0.5 rounded-full font-medium">{ing.name}</span>
            ))}
            {vegCount === 0 && <span className="text-[9px] text-white/70">Add veg</span>}
          </div>
        </div>

        {/* Protein - BOTTOM RIGHT (25%) */}
        <div className="absolute bottom-0 right-0 w-1/2 h-3/4 bg-[#C62828] flex flex-wrap items-center justify-center p-2 overflow-y-auto border-t-2 border-white/40">
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[12px] font-bold text-white">Protein</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-8 w-full">
            {selectedIngredients.filter(i => i.category === 'protein').map(ing => (
              <span key={ing.id} className="text-[10px] bg-white/70 text-slate-800 px-2 py-0.5 rounded-full font-medium">{ing.name}</span>
            ))}
            {proteinCount === 0 && <span className="text-[9px] text-white/70">Add protein</span>}
          </div>
        </div>

        {/* Oils Circle - CENTER (emoji only) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#F9A825] border-2 border-white shadow-md flex items-center justify-center z-20">
          <span className="text-base font-bold text-white">💧</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6" id="plate-builder-section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-orange animate-pulse" /> Build My Plate
        </h2>
        <p className="text-slate-600 text-sm">
          Put the <span className="font-semibold text-brand-green">Healthy Plate Healthy Planet</span> science into practice. Build affordable, low-carbon meals visually and learn where to make sustainable swaps.
        </p>
      </div>

      {/* 5 Plate Options - Quick Load */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Load:</span>
        {PLATE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => loadPlateOption(option)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
          >
            {option.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Plate Display */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            {/* Plate Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800">
                BUILD YOUR OWN HEALTHY PLATE
              </span>
              <button
                onClick={clearPlate}
                disabled={selectedIngredients.length === 0}
                className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Plate
              </button>
            </div>

            {/* Plate */}
            <div className="relative max-w-md mx-auto">
              {renderPlateSections()}
            </div>

            {/* Oils Section - OUTSIDE THE PLATE */}
            {fatsCount > 0 && (
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-amber-700">💧 Oils</span>
                <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
                  {selectedIngredients.filter(i => i.category === 'fats').map(ing => (
                    <span key={ing.id} className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Star Rating & Detailed Feedback */}
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
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

              {/* Detailed Feedback */}
              {totalItems > 0 && detailedFeedback && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{detailedFeedback}</p>
                  </div>
                </div>
              )}

              <div className={`p-3 rounded-xl border ${balanceColor} text-xs`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> Balance Check: {balanceStatus}
                </div>
                <p className="leading-relaxed opacity-90 mt-0.5">{balanceMessage}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-lg font-bold">♻️</div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-800">Sustainable Swap!</div>
                  <p className="text-slate-600">{activeSwap.benefit}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-[#047857]">
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
              <form onSubmit={handleSavePlate} className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Name your meal..."
                  value={plateName}
                  onChange={(e) => setPlateName(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-orange-650 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-white" /> Save Plate
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Ingredient Selection */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-extrabold text-brand-green text-sm flex items-center justify-between mb-4">
              <span>Choose Ingredients</span>
              <span className="text-xs text-slate-400 font-normal">{totalItems} selected</span>
            </h3>

            {/* Category Filters - Horizontal Scroll on Mobile */}
            <div className="flex flex-nowrap overflow-x-auto gap-1 mb-4 pb-2 sm:flex-wrap sm:overflow-visible">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("all")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition whitespace-nowrap cursor-pointer ${
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
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition whitespace-nowrap cursor-pointer ${
                      active ? "bg-brand-green text-white border-brand-green shadow-sm" : `${style.bg} ${style.text} ${style.border} hover:opacity-85`
                    }`}
                  >
                    {cat === "fruit_veg" ? "🥕" : cat === "wholegrain" ? "🌾" : cat === "protein" ? "🥚" : cat === "dairy" ? "🥛" : "💧"}
                    {style.label}
                  </button>
                );
              })}
            </div>

            {/* Ingredient Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 flex-1 overflow-y-auto max-h-[400px] pr-1">
              {INITIAL_INGREDIENTS.filter(
                (ing) => selectedCategoryFilter === "all" || ing.category === selectedCategoryFilter
              ).map((ing) => {
                const style = categoryStyles[ing.category] || categoryStyles.fruit_veg;
                const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                const IconComponent = style.icon;

                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-wrap items-center justify-between gap-2 cursor-pointer min-h-[44px] ${
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
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Heart className="w-3 h-3 text-red-500 fill-current" /> My Saved Creations ({savedPlates.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedPlates.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="font-bold text-slate-800 leading-tight truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2">
                    <span>{p.date}</span>
                    <span>•</span>
                    <span>£{p.cost.toFixed(2)}</span>
                    <span>•</span>
                    <span className="text-emerald-600">{p.co2.toFixed(2)}kg</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSavedPlate(p.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition flex-shrink-0"
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
