import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { MyPlateBuilder } from "./components/MyPlateBuilder";
import { ShopSmart } from "./components/ShopSmart";
import { CookHome } from "./components/CookHome";
import { MythBusterSection } from "./components/MythBusterSection";
import { WeeklyChallengesTracker } from "./components/WeeklyChallengesTracker";
import { Competition } from "./components/Competition";
import { ProgressPathways } from "./components/ProgressPathways";
import { CMUKLogo } from "./components/icons/CMUKLogo";
import {
  Home,
  Utensils,
  BookOpen,
  ShoppingCart,
  Brain,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Heart,
  Lightbulb,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  Plus,
  Trophy
} from "lucide-react";

type Tab =
  | "home"
  | "plates"
  | "recipes"
  | "myths"
  | "challenges"
  | "competition"
  | "dishcosts";

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [streak, setStreak] = useState(12);
  const [points, setPoints] = useState(340);
  const [goalCompleted, setGoalCompleted] = useState(false);

  // Sync state stats directly from localStorage triggers
  const syncStats = () => {
    const rawPoints = localStorage.getItem("cmuk_points");
    const rawStreak = localStorage.getItem("cmuk_streak");
    if (rawPoints) setPoints(Number(rawPoints));
    if (rawStreak) setStreak(Number(rawStreak));
  };

  useEffect(() => {
    syncStats();
    window.addEventListener("cmuk_stat_update", syncStats);
    return () => window.removeEventListener("cmuk_stat_update", syncStats);
  }, []);

  const handleMarkGoalComplete = () => {
    if (goalCompleted) return;
    setGoalCompleted(true);
    const nextPoints = points + 50;
    const nextStreak = streak + 1;
    setPoints(nextPoints);
    setStreak(nextStreak);
    localStorage.setItem("cmuk_points", String(nextPoints));
    localStorage.setItem("cmuk_streak", String(nextStreak));
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "plates", label: "A Balanced Plate", icon: Utensils },
    { id: "recipes", label: "CMUK Recipes", icon: CMUKLogo },
    { id: "myths", label: "Mythbusters", icon: Brain },
    { id: "challenges", label: "Challenges", icon: Award },
    { id: "competition", label: "Competition", icon: Trophy },
    { id: "dishcosts", label: "Dish Costs", icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal font-sans flex flex-col justify-between">
      {/* Brand Top Header Bar */}
      <header className="bg-white border-b border-orange-100/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Brand Title - USING REAL LOGO */}
          <div className="flex items-center gap-2.5 select-none text-left">
            <img 
              src="/logo.png" 
              alt="Culinary Medicine UK" 
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-baseline font-sans text-[21px] tracking-tight leading-none">
                <span className="font-light text-[#1A1A1A]">Culinary</span>
                <span className="font-extrabold text-[#1A1A1A]">Medicine</span>
                <span className="font-light text-[#1A1A1A]">UK</span>

              </div>
              <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest leading-none mt-1">
                Fuel Your Future
              </p>
               <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest leading-none mt-1">
                Today's Chefs in Training
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="flex flex-wrap items-center bg-slate-100/60 p-1 rounded-xl border border-slate-200/50">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-brand-green text-white shadow-sm"
                      : "text-brand-green/80 hover:text-brand-green hover:bg-slate-200/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-brand-orange" : "text-brand-green/50"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Page Content Stage */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "home" && (
          <div className="space-y-8 animate-fade-in">
            {/* NEW: Future of Food Welcome Banner */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="relative z-10 text-left space-y-4">
                {user?.first_name && (
                  <p className="text-xl sm:text-2xl font-medium text-brand-charcoal">
                    Welcome back, {user.first_name}!
                  </p>
                )}
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-green leading-tight">
                  The Future of Food <br className="sm:hidden" />
                  <span className="text-brand-orange">is in Your Hands.</span>
                </h1>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Welcome to your digital companion. As a culinary professional, you are more than a chef—you are a champion for health and sustainability.
                </p>

                <a
                  href="/FuelYourFuture_GettingStarted.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-orange-600 transition underline underline-offset-2"
                >
                  📄 Download the Fuel Your Future Getting Started Guide
                </a>

                <div className="bg-[#FFEDD5] rounded-xl p-4 border border-orange-200/55 max-w-2xl">
                  <h3 className="text-sm font-extrabold text-brand-orange mb-1">The "Healthy Plate, Healthy Planet" Principle:</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    We believe that exceptional food must be three things: <strong>Nutritious</strong> for the customer, <strong>Sustainable</strong> for the environment, and <strong>Professional</strong> in its execution.
                  </p>
                </div>

                <div className="max-w-2xl">
                  <h3 className="text-sm font-extrabold text-brand-green mb-1">Why Fuel Your Future?</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The modern customer demands more than just flavour. By mastering the art of the "Healthy Swap" and understanding the importance of allergens, clinical dietary needs, you increase your commercial appeal, reduce waste, and build a career defined by innovation rather than limitation.
                  </p>
                </div>

                <div className="max-w-2xl">
  <h3 className="text-sm font-extrabold text-brand-green mb-1">
    Invest in Your Craft. Invest in Your Own Health. </h3>
  <p className="text-xs text-slate-600 leading-relaxed">
    A professional kitchen is a high-performance environment. By understanding the fuel your own body needs to thrive, you optimise your health, sharpen your focus, and sustain your creativity. Great chefs care deeply for their ingredients — the greatest chefs know that the most important ingredient in the kitchen is you!
  </p>
  <p className="text-xs text-slate-600 leading-relaxed mt-2">
    Let's get your kitchen setup started.
  </p>
</div>

                <button
                  onClick={() => setActiveTab("plates")}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-[#1A3C34]/90 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Row - Keep */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
                <span className="text-3xl">🔥</span>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">DAY STREAK</span>
                  <strong className="text-brand-green text-sm font-black leading-tight">{streak} Days Ready</strong>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
                <span className="text-3xl">⭐️</span>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">TOTAL POINTS</span>
                  <strong className="text-brand-green text-sm font-black leading-tight">{points} pts</strong>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
                <span className="text-3xl">⚡️</span>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">PROFILE COMPLETE</span>
                  <strong className="text-brand-green text-sm font-black leading-tight">75% Verified</strong>
                </div>
              </div>
            </div>

            {/* Quick Access Bento Navigation Grid */}
            <div className="space-y-4">
              <h3 className="font-bold text-brand-green text-sm px-1 text-left uppercase tracking-wider text-xs text-brand-green/70 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> Fast Navigation Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <button
                  onClick={() => setActiveTab("plates")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-emerald-50 group-hover:scale-105 transition">🍽️</span>
                  <span className="text-xs font-black text-brand-green leading-none">Healthy Plates</span>
                </button>
                <button
                  onClick={() => setActiveTab("recipes")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-[#FFEDD5] group-hover:scale-105 transition">👨‍🍳</span>
                  <span className="text-xs font-black text-brand-green leading-none">CMUK Recipes</span>
                </button>
                <button
                  onClick={() => setActiveTab("dishcosts")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-blue-50 group-hover:scale-105 transition">💰</span>
                  <span className="text-xs font-black text-brand-green leading-none">Dish Costs</span>
                </button>
                <button
                  onClick={() => setActiveTab("myths")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-indigo-50 group-hover:scale-105 transition">🧠</span>
                  <span className="text-xs font-black text-brand-green leading-none">Mythbusters</span>
                </button>
                <button
                  onClick={() => setActiveTab("challenges")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-orange-50 group-hover:scale-105 transition">🎯</span>
                  <span className="text-xs font-black text-brand-green leading-none">Challenges</span>
                </button>
                <button
                  onClick={() => setActiveTab("competition")}
                  className="bg-white border hover:border-brand-orange/30 border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm transition hover:shadow cursor-pointer group"
                >
                  <span className="text-3xl p-2 rounded-xl bg-purple-50 group-hover:scale-105 transition">🏆</span>
                  <span className="text-xs font-black text-brand-green leading-none">Competition</span>
                </button>
              </div>
            </div>

            {/* Featured Recipe - Keep */}
            <div className="space-y-4">
              <h3 className="font-bold text-brand-green text-sm px-1 text-left uppercase tracking-wider text-xs text-brand-green/70">
                ⭐ Featured Student Survival Meal
              </h3>
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center text-left">
                <img
                  src="https://rainbowplantlife.com/wp-content/uploads/2020/09/redlentilcurryflatstraight-2020update281of129-scaled.jpg"
                  alt="Lentil Curry"
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                <div className="space-y-1.5 flex-1 select-none">
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Only £0.70 Per Serving
                  </span>
                  <h4 className="font-black text-sm text-brand-green leading-none">
                    Creamy Westminster Red Lentil Curry
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
                    Our absolute flagship, highest-nutrition recipes. Split lentils need zero pre-soaking, are ultra low-carbon, pack 18g of complete protein, and prepare in under 20 minutes!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("recipes")}
                  className="bg-brand-green hover:bg-[#1A3C34]/90 text-white font-black py-2 px-4 rounded-xl text-xs whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  View Cooking Steps <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Framework - Keep */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 text-left">
              <h3 className="font-black text-brand-green text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                🏫 Westminster's Fuel Your Future Educational Framework
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                <div className="space-y-1.5 border-l-2 border-[#F27D26]/40 pl-4 py-1">
                  <span className="text-[9.5px] bg-[#FFEDD5] text-[#C2410C] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Level 1: Inspire
                  </span>
                  <h4 className="font-extrabold text-[#F27D26] text-xs">FUEL YOUR FUTURE LIVE</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Attend a 2-hour interactive Westminster cookery workshop delivered by professional CMUK chefs and dieticians. Discover healthy eating, food myths vs facts, and healthy plate structures:
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block italic uppercase pt-1">
                    ✓ Outcome: "I understand what good nutrition looks like."
                  </span>
                </div>

                <div className="space-y-1.5 border-l-2 border-brand-orange pl-4 py-1">
                  <span className="text-[9.5px] bg-orange-100 text-orange-850 font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Level 2: Activate
                  </span>
                  <h4 className="font-extrabold text-brand-orange text-xs">DIGITAL WRAPAROUND SUPPORT</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Utilize this portal to practice clinical culinary skills at home, log budget shopping lists, discover Westminster survival recipes, and query our active AI food coach.
                  </p>
                  <span className="text-[10px] text-brand-orange font-bold block italic uppercase pt-1">
                    ✓ Outcome: "I am putting healthy habits into action."
                  </span>
                </div>

                <div className="space-y-1.5 border-l-2 border-[#047857]/45 pl-4 py-1">
                  <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-1.5 py-0.5 rounded">
                    Level 3: Progress
                  </span>
                  <h4 className="font-extrabold text-emerald-600 text-xs">WESTMINSTER UNIVERSITY PATHWAY</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Convert points into certified skills courses, Hospitality academies, apprenticeships, and direct employer interview connections in premium hotels and public clinical bodies.
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold block italic uppercase pt-1">
                    ✓ Outcome: "I have direct avenues into industry."
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Benders */}
        {activeTab === "plates" && <MyPlateBuilder />}
        {activeTab === "recipes" && <CookHome />}
        {activeTab === "myths" && <MythBusterSection />}
        {activeTab === "challenges" && <WeeklyChallengesTracker />}
        {activeTab === "competition" && <Competition />}
        {activeTab === "dishcosts" && <ShopSmart />}
      </main>

      {/* Culinary Medicine UK Footer Block */}
      <footer className="bg-[#e45b10] text-slate-300 border-t border-slate-950/40 py-10 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center select-none">
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 pb-1">
              <span className="font-extrabold text-white text-[11px] uppercase tracking-wider">Culinary Medicine UK</span>
              <span className="text-brand-orange">•</span>
              <span className="text-[10px] text-brand-orange uppercase font-semibold">Fuel Your Future</span>
            </div>
            <p className="text-[#ebf2f9] leading-relaxed text-[11px] max-w-sm font-light">
              An educational and clinical framework building knife confidence, nutrition wisdom, and London career gateways.
            </p>
          </div>

          <div className="space-y-1 text-center md:text-right">
            <p className="text-white font-bold hover:text-white/90 transition text-sm tracking-wider">
              EAT BETTER • FEEL BETTER • LEARN BETTER • WORK BETTER
            </p>
            <p className="text-slate-350/65 text-[10px]">
              © {new Date().getFullYear()} Culinary Medicine UK. All rights reserved. Registered non-profit educational companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
