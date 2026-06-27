import { useState, useEffect } from "react";
import { WESTMINSTER_COURSES } from "../data";
import { BookOpen, GraduationCap, Briefcase, Award, ArrowUpRight, CheckCircle, Sparkles, AlertCircle } from "lucide-react";

export function ProgressPathways() {
  const [completeCount, setCompleteCount] = useState(0);
  const [userPoints, setUserPoints] = useState(0);

  // Read points and completed challenges from localStorage to make the dashboard dynamic!
  useEffect(() => {
    const readStats = () => {
      const rawChallenges = localStorage.getItem("cmuk_challenges");
      const rawPoints = localStorage.getItem("cmuk_points");
      if (rawChallenges) {
        try {
          const parsed = JSON.parse(rawChallenges);
          const done = parsed.filter((c: any) => c.completed).length;
          setCompleteCount(done);
        } catch (e) {
          console.error(e);
        }
      }
      if (rawPoints) {
        setUserPoints(Number(rawPoints));
      }
    };

    readStats();

    // Listen for custom trigger event
    window.addEventListener("cmuk_stat_update", readStats);
    return () => window.removeEventListener("cmuk_stat_update", readStats);
  }, []);

  return (
    <div className="space-y-8" id="progress-pathways-section">
      {/* Tracker Hero metrics */}
      <div className="bg-gradient-to-r from-brand-green to-[#112923] rounded-3xl p-6 text-[#FAF9F6] border border-[#112923] relative overflow-hidden shadow-md text-left animate-fade-in">
        <div className="absolute right-0 top-0 opacity-10 font-bold text-[180px] select-none text-brand-cream pointer-events-none translate-x-12 translate-y-[-40px]">
          🎓
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="flex items-center gap-1.5 text-brand-orange font-extrabold text-[11px] uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Level 3: Career Progression Pathways
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Elevate Your Skills from Kitchen Confidence to London Employment!
          </h2>
          <p className="text-[#ECEBE4] text-xs sm:text-xs leading-relaxed font-sans">
            Most health programmes stop at awareness, but double value occurs when wellness meets employability. Westminster Kingsway College and CMUK offer direct pathways for outstanding learners to convert their points into certified credentials, kitchen academies, and placements.
          </p>

          {/* Student Status indicator */}
          <div className="pt-2">
            <span className="text-[10px] text-brand-cream/70 font-bold uppercase tracking-wider">My University Eligibility:</span>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
              <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                completeCount >= 1 ? "bg-[#D1FAE5] text-[#047857] border-[#047857]/40" : "bg-[#112923]/95 text-brand-cream/50 border-[#ffffff10]"
              }`}>
                {completeCount >= 1 ? "🎉 Saturday Club Vibe Unlocked!" : "🔒 Complete Week 1 to unlock Vouchers"}
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                completeCount >= 3 ? "bg-[#FFE4E6] text-[#E11D48] border-red-200" : "bg-[#112923]/95 text-brand-cream/50 border-[#ffffff10]"
              }`}>
                {completeCount >= 3 ? "💼 Westminster Academy Ready!" : "🔒 Complete Week 3 for Interview Placements"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Skills Development pathways (col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-1.5 px-0.5">
            <GraduationCap className="w-5 h-5 text-brand-orange" /> Professional Skills Development
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed px-0.5 font-sans">
            Certified courses designed to develop fundamental culinary excellence and food technology biochemistry:
          </p>

          <div className="space-y-4 pt-1">
            {WESTMINSTER_COURSES.filter(c => c.level === "skills").map((c, idx) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group text-left">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] bg-emerald-50 text-brand-green font-bold uppercase px-1.5 py-0.2 rounded">
                      CMUK Certified • {c.duration}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-brand-green leading-tight pt-1">
                      {c.title}
                    </h4>
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 transition flex items-center justify-center cursor-pointer"
                    title="Visit Course Portal"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {c.description}
                </p>

                <div className="p-3 bg-orange-50/40 rounded-xl border border-orange-100/40 text-[10.5px] leading-relaxed text-slate-600 font-sans">
                  <strong className="text-[#112923] font-semibold block">Key Career Outcome:</strong>
                  {c.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Employability & placements (col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-1.5 px-0.5">
            <Briefcase className="w-5 h-5 text-brand-orange" /> Employability Skills & Placements
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed px-0.5 font-sans">
            Accelerated employment modules linking you to direct kitchen operations, NHS catering, and premium hotel apprenticeships:
          </p>

          <div className="space-y-4 pt-1">
            {WESTMINSTER_COURSES.filter(c => c.level === "employment").map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group text-left">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] bg-orange-50 text-brand-orange font-bold uppercase px-1.5 py-0.2 rounded">
                      Employability track • {c.duration}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-brand-green leading-tight pt-1">
                      {c.title}
                    </h4>
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 transition flex items-center justify-center cursor-pointer"
                    title="Enquire Portal"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {c.description}
                </p>

                <div className="p-3 bg-orange-50/40 rounded-xl border border-orange-100/40 text-[10.5px] leading-relaxed text-slate-600 font-sans">
                  <strong className="text-[#112923] font-semibold block">Westminster Job Outcome:</strong>
                  {c.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bigger Vision Statement footer */}
      <div className="p-5 bg-orange-55/65 rounded-2xl border border-orange-200/50 text-xs text-slate-700 space-y-2.5 text-left">
        <h4 className="font-extrabold text-brand-green flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
          👑 The Fuel Your Future Bigger Vision
        </h4>
        <p className="leading-relaxed">
          Culinary Medicine UK combines nutrition literacy with Westminster employability structures. Healthy nutrition acts as a foundation: <strong className="text-brand-orange">Eat Better → Feel Better → Learn Better → Work Better</strong>.
        </p>
        <p className="leading-relaxed text-slate-500 text-[11px] italic font-sans">
          This framework is fundable through NHS prevention, social prescribing, Greater London Authority (GLA) wellbeing structures, and public health food-poverty interventions. By improving student wellbeing, we drive higher class retention, lower absenteeism, and build London's next generation restaurant workforce.
        </p>
      </div>
    </div>
  );
}
