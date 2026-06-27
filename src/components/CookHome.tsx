import { useState } from "react";
import { STUDENT_MEALS } from "../data";
import { Recipe } from "../types";
import { Clock, ChefHat, Flame, BookOpen, AlertCircle, Heart } from "lucide-react";

export function CookHome() {
  const [selectedBudget, setSelectedBudget] = useState<"all" | "under2" | "under3" | "under5">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(STUDENT_MEALS[0]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Collect all unique tags for filter tags
  const allTags = Array.from(
    new Set(STUDENT_MEALS.flatMap((m) => m.tags))
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredMeals = STUDENT_MEALS.filter((m) => {
    const budgetMatch = selectedBudget === "all" || m.category === selectedBudget;
    const tagMatch = selectedTag === "all" || m.tags.includes(selectedTag);
    return budgetMatch && tagMatch;
  });

  return (
    <div className="space-y-8" id="cook-home-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-green flex items-center justify-center gap-2">
          🍳 Cook at Home & Student Survival Meals
        </h2>
        <p className="text-slate-600 text-sm">
          Whip up ultra-affordable, delicious meals formulated by professional <span className="font-semibold text-brand-orange">Westminster Kingsway Chefs</span> and clinical nutrition dieticians.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Recipe List & Filter Grid (col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Filters Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price Category Limits</span>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSelectedBudget("all")}
                  className={`py-2 rounded-lg text-center transition cursor-pointer ${selectedBudget === "all" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedBudget("under2")}
                  className={`py-2 rounded-lg text-center transition cursor-pointer ${selectedBudget === "under2" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  Under £2
                </button>
                <button
                  onClick={() => setSelectedBudget("under3")}
                  className={`py-2 rounded-lg text-center transition cursor-pointer ${selectedBudget === "under3" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  Under £3
                </button>
                <button
                  onClick={() => setSelectedBudget("under5")}
                  className={`py-2 rounded-lg text-center transition cursor-pointer ${selectedBudget === "under5" ? "bg-brand-green text-white shadow-sm" : "text-slate-500"}`}
                >
                  Under £5
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Diet Type Filters</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedTag("all")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                    selectedTag === "all"
                      ? "bg-brand-green text-white border-brand-green font-bold shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  All Meals
                </button>
                {allTags.map((tag) => {
                  const active = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        active
                          ? "bg-brand-green text-white border-brand-green font-bold shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* List of Recipe Cards */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredMeals.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                No Westminster chef recipes found matching your filter combinations. Try resetting filters.
              </div>
            ) : (
              filteredMeals.map((meal) => {
                const isSelected = selectedRecipe?.id === meal.id;
                const isFav = favorites.includes(meal.id);

                return (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedRecipe(meal)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex gap-4 ${
                      isSelected
                        ? "bg-brand-green border-brand-green text-white shadow-md ring-1 ring-brand-orange/50"
                        : "bg-white hover:bg-slate-50 border-slate-100 text-slate-700 shadow-sm"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-100/10"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-xs leading-snug line-clamp-2 max-w-[200px]">
                            {meal.title}
                          </h4>
                          <button
                            onClick={(e) => toggleFavorite(meal.id, e)}
                            className="p-1 rounded-full text-slate-300 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition -mt-1 -mr-1"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "text-red-500 fill-current" : ""}`} />
                          </button>
                        </div>

                        {/* Cost & time badges */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className={`font-bold ${isSelected ? "text-brand-orange" : "text-brand-orange"}`}>
                            £{meal.costPerServing.toFixed(2)} per serving
                          </span>
                          <span className={isSelected ? "text-slate-400" : "text-slate-400"}>•</span>
                          <span className={`font-medium flex items-center gap-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                            <Clock className="w-2.5 h-2.5" /> {meal.time}
                          </span>
                        </div>
                      </div>

                      {/* Display first 2 tags only to stay compact */}
                      <div className="flex gap-1 overflow-hidden">
                        {meal.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                              isSelected ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Hand: Detailed Step-by-Step Cooking Guide (col-span-7) */}
        <div className="lg:col-span-7">
          {selectedRecipe ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in flex flex-col">
              {/* Cover Image banner */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C34]/95 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-brand-orange text-white font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                      Westminster Kingsway Chefs recipe
                    </span>
                    <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">
                      {selectedRecipe.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">EST. COST</span>
                    <strong className="text-slate-800 text-sm font-bold font-mono">£{selectedRecipe.costPerServing.toFixed(2)}</strong>
                    <span className="text-[8px] text-slate-400 block font-semibold">per portion</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">PROTEIN</span>
                    <strong className="text-emerald-600 text-sm font-bold font-mono">{selectedRecipe.nutrition.protein}</strong>
                    <span className="text-[8px] text-slate-400 block font-semibold">{selectedRecipe.nutrition.calories} kcal</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">CARBS</span>
                    <strong className="text-slate-800 text-sm font-bold font-mono">{selectedRecipe.nutrition.carbs}</strong>
                    <span className="text-[8px] text-slate-400 block font-semibold">Sustained GI</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">FIBER</span>
                    <strong className="text-[#3b82f6] text-sm font-bold font-mono">{selectedRecipe.nutrition.fiber}</strong>
                    <span className="text-[8px] text-[#3b82f6] block font-semibold">Prebiotic</span>
                  </div>
                </div>

                {/* Split list: Ingredients & instructions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Ingredients (40%) */}
                  <div className="md:col-span-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-orange-100">
                      <BookOpen className="w-3.5 h-3.5 text-brand-orange" /> Ingredients
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
                      {selectedRecipe.ingredients.map((ing) => (
                        <li key={ing} className="flex items-start gap-1.5">
                          <span className="text-brand-orange font-bold mt-0.5">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cooking Steps (60%) */}
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-orange-100">
                      <Flame className="w-3.5 h-3.5 text-brand-orange" /> Cooking Steps
                    </h4>
                    <ol className="space-y-3 text-xs text-slate-600 font-sans">
                      {selectedRecipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="w-4.5 h-4.5 bg-[#FFEDD5] text-[#C2410C] font-extrabold rounded-full flex items-center justify-center text-[10px] flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Westminster Chef Tip Box */}
                {selectedRecipe.chefTips && (
                  <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/60 rounded-xl flex items-start gap-3 text-xs">
                    <ChefHat className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 font-sans block">Chef's Secret Tips:</span>
                      <p className="text-slate-600 leading-relaxed italic">{selectedRecipe.chefTips}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 text-xs">
              Select one of the meals on the left to inspect step-by-step cooking commands.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
