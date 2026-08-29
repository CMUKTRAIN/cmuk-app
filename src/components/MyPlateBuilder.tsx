import { useState, useEffect } from "react";
import { Ingredient, Category } from "../types";
import { INITIAL_INGREDIENTS } from "../data";
import { 
  Carrot, Wheat, Leaf, Egg, Droplet, Sparkles, AlertCircle, Trash2, 
  Heart, Plus, CheckCircle, Info, Star, Droplets, Activity, 
  Globe, Utensils, Users 
} from "lucide-react";

interface SavedPlate {
  id: string;
  name: string;
  ingredients: Ingredient[];
  cost: number;
  co2: number;
  date: string;
}

type PlateType = "harvard" | "uk" | "canadian";

// Updated category names with display labels
const categoryLabels: Record<Category, string> = {
  fruit_veg: "Fruit & Veg",
  wholegrain: "Whole Grains",
  protein: "Protein",
  dairy: "Dairy",
  fats: "Healthy Oils",
  junk: "Junk Food",
};

// Color palette
const COLORS = {
  green: "#4CAF50",
  amber: "#D4A017",
  red: "#E57373",
  yellow: "#F9A825",
  pink: "#F48FB1",
};

// Plate configurations
const PLATE_CONFIGS = {
  harvard: {
    label: "Harvard",
    icon: Globe,
    sections: [
      { id: "veg", label: "Vegetables & Fruits", proportion: "50%", color: COLORS.green, category: "fruit_veg" },
      { id: "grains", label: "Whole Grains", proportion: "25%", color: COLORS.amber, category: "wholegrain" },
      { id: "protein", label: "Healthy Protein", proportion: "25%", color: COLORS.red, category: "protein" },
      { id: "oils", label: "Healthy Oils", proportion: "", color: COLORS.yellow, category: "fats", isCircle: true },
    ],
  },
  uk: {
    label: "UK Eatwell",
    icon: Users,
    sections: [
      { id: "carbs", label: "Carbohydrates", proportion: "38%", color: COLORS.amber, category: "wholegrain" },
      { id: "veg", label: "Fruit & Vegetables", proportion: "33%", color: COLORS.green, category: "fruit_veg" },
      { id: "protein", label: "Protein", proportion: "13%", color: COLORS.red, category: "protein" },
      { id: "dairy", label: "Dairy & Alternatives", proportion: "8%", color: COLORS.yellow, category: "dairy" },
      { id: "sugar", label: "High Fat/Sugar", proportion: "8%", color: COLORS.pink, category: "junk" },
    ],
  },
  canadian: {
    label: "Canadian",
    icon: Leaf,
    sections: [
      { id: "veg", label: "Vegetables & Fruits", proportion: "50%", color: COLORS.green, category: "fruit_veg" },
      { id: "grains", label: "Whole Grains", proportion: "25%", color: COLORS.amber, category: "wholegrain" },
      { id: "protein", label: "Protein", proportion: "25%", color: COLORS.red, category: "protein" },
    ],
  },
};

export function MyPlateBuilder() {
  const [selectedPlate, setSelectedPlate] = useState<PlateType>("harvard");
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

    if (hasVeg && hasGrain && hasProtein) {
      score += 3;
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

  const { stars, feedback, color: scoreColor } = calculateScore();

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
    junk: { border: "border-pink-300", bg: "bg-pink-50", text: "text-pink-700", icon: AlertCircle, label: "Junk Food" },
  };

  // --- RENDER PLATE SECTIONS ---
  const renderPlateSections = () => {
    const config = PLATE_CONFIGS[selectedPlate];
    const isUK = selectedPlate === "uk";

    // For UK plate - custom layout with 5 sections
    if (isUK) {
      return (
        <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-slate-300 shadow-lg">
          {/* Carbs - Top (38%) */}
          <div className="absolute top-0 left-0 w-full h-[38%] bg-[#D4A017] flex flex-wrap items-center justify-center p-2 overflow-y-auto">
            <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Carbs (38%)</span>
            <div className="flex flex-wrap items-center justify-center gap-1 mt-5 w-full">
              {selectedIngredients.filter(i => i.category === 'wholegrain').map(ing => (
                <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
              ))}
              {grainCount === 0 && <span className="text-[8px] text-white/70">Add carbs</span>}
            </div>
          </div>

          {/* Veg - Bottom Left (33%) */}
          <div className="absolute bottom-0 left-0 w-[55%] h-[62%] bg-[#4CAF50] flex flex-wrap items-center justify-center p-2 overflow-y-auto border-t-2 border-r-2 border-white/30">
            <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Veg (33%)</span>
            <div className="flex flex-wrap items-center justify-center gap-1 mt-5 w-full">
              {selectedIngredients.filter(i => i.category === 'fruit_veg').map(ing => (
                <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
              ))}
              {vegCount === 0 && <span className="text-[8px] text-white/70">Add veg</span>}
            </div>
          </div>

          {/* Protein - Bottom Right Top (13%) */}
          <div className="absolute bottom-[25%] right-0 w-[45%] h-[37%] bg-[#E57373] flex flex-wrap items-center justify-center p-2 overflow-y-auto border-t-2 border-white/30">
            <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Protein (13%)</span>
            <div className="flex flex-wrap items-center justify-center gap-1 mt-5 w-full">
              {selectedIngredients.filter(i => i.category === 'protein').map(ing => (
                <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
              ))}
              {proteinCount === 0 && <span className="text-[8px] text-white/70">Add protein</span>}
            </div>
          </div>

          {/* Dairy - Bottom Right (8%) */}
          <div className="absolute bottom-[13%] right-0 w-[45%] h-[12%] bg-[#F9A825] flex flex-wrap items-center justify-center p-1 overflow-y-auto border-t-2 border-white/30">
            <span className="text-[7px] font-bold text-white">Dairy (8%)</span>
            <div className="flex flex-wrap items-center justify-center gap-0.5 ml-1">
              {selectedIngredients.filter(i => i.category === 'dairy').map(ing => (
                <span key={ing.id} className="text-[6px] bg-white/90 text-slate-800 px-1 rounded-full">{ing.name}</span>
              ))}
              {categoryCounts.dairy === 0 && <span className="text-[6px] text-white/70">Add dairy</span>}
            </div>
          </div>

          {/* Sugar - Bottom Right Bottom (8%) - PINK */}
          <div className="absolute bottom-0 right-0 w-[45%] h-[13%] bg-[#F48FB1] flex flex-wrap items-center justify-center p-1 overflow-y-auto border-t-2 border-white/30">
            <span className="text-[7px] font-bold text-white">Sugar (8%)</span>
            <div className="flex flex-wrap items-center justify-center gap-0.5 ml-1">
              {selectedIngredients.filter(i => i.category === 'junk').map(ing => (
                <span key={ing.id} className="text-[6px] bg-white/90 text-slate-800 px-1 rounded-full">{ing.name}</span>
              ))}
              {categoryCounts.junk === 0 && <span className="text-[6px] text-white/70">Add treats</span>}
            </div>
          </div>
        </div>
      );
    }

    // Harvard & Canadian plates - standard layout
    return (
      <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-slate-300 shadow-lg">
        {/* Veg - Top Half (50%) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#4CAF50] flex flex-wrap items-center justify-center p-4 pt-6 gap-1 overflow-y-auto">
          <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Veg & Fruits (50%)</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-6 w-full">
            {selectedIngredients.filter(i => i.category === 'fruit_veg').map(ing => (
              <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
            ))}
            {vegCount === 0 && <span className="text-[8px] text-white/70">Add veg</span>}
          </div>
        </div>

        {/* Grains - Bottom Left (25%) */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#D4A017] flex flex-wrap items-center justify-center p-4 pt-6 gap-1 overflow-y-auto border-t-2 border-r-2 border-white/30">
          <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Grains (25%)</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-6 w-full">
            {selectedIngredients.filter(i => i.category === 'wholegrain').map(ing => (
              <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
            ))}
            {grainCount === 0 && <span className="text-[8px] text-white/70">Add grains</span>}
          </div>
        </div>

        {/* Protein - Bottom Right (25%) */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#E57373] flex flex-wrap items-center justify-center p-4 pt-6 gap-1 overflow-y-auto border-t-2 border-white/30">
          <span className="absolute top-1 left-2 text-[8px] font-bold text-white">Protein (25%)</span>
          <div className="flex flex-wrap items-center justify-center gap-1 mt-6 w-full">
            {selectedIngredients.filter(i => i.category === 'protein').map(ing => (
              <span key={ing.id} className="text-[8px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded-full">{ing.name}</span>
            ))}
            {proteinCount === 0 && <span className="text-[8px] text-white/70">Add protein</span>}
          </div>
        </div>

        {/* Oils Circle - Harvard only */}
        {selectedPlate === "harvard" && (
          <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full bg-[#F9A825] border-2 border-white shadow-md flex flex-col items-center justify-center p-1">
            <span className="text-[6px] font-bold text-white uppercase text-center leading-tight">Healthy Oils</span>
            <div className="flex flex-wrap items-center justify-center gap-0.5 mt-0.5">
              {selectedIngredients.filter(i => i.category === 'fats').map(ing => (
                <span key={ing.id} className="text-[6px] bg-white/90 text-slate-800 px-1 rounded-full">{ing.name}</span>
              ))}
              {fatsCount === 0 && <span className="text-[5px] text-white/80">Add oils</span>}
            </div>
          </div>
        )}
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

      {/* Plate Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        {(Object.keys(PLATE_CONFIGS) as PlateType[]).map((plateKey) => {
          const config = PLATE_CONFIGS[plateKey];
          const Icon = config.icon;
          return (
            <button
              key={plateKey}
              onClick={() => setSelectedPlate(plateKey)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                selectedPlate === plateKey
                  ? "bg-brand-green text-white shadow-md"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Plate Display */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            {/* Plate Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-800">
                {PLATE_CONFIGS[selectedPlate].label}-STYLE HEALTHY PLATE
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

            {/* Score & Balance */}
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
                    {cat === "fruit_veg" ? "🥕" : cat === "wholegrain" ? "🌾" : cat === "protein" ? "🥚" : cat === "dairy" ? "🥛" : cat === "fats" ? "💧" : "🍩"}
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
