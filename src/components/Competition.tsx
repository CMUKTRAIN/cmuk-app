export function Competition() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">🏆</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-green">Healthy Plate, Healthy Planet Competition 2027</h1>
        </div>

        <div className="space-y-6 text-left">
          <div className="bg-gradient-to-r from-brand-green/5 to-brand-orange/5 rounded-xl p-5 border border-brand-green/10">
            <h2 className="font-bold text-brand-green text-sm mb-2">🎯 Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We are searching for tomorrow's culinary leaders. Open to all Level 1 students, this competition rewards those who champion nutrition, allergen safety, and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Launch Date</span>
              <p className="text-lg font-extrabold text-brand-green mt-1">March 2027</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eligibility</span>
              <p className="text-lg font-extrabold text-brand-green mt-1">All Level 1 Students</p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h3 className="font-bold text-amber-800 text-sm mb-2">📋 What You'll Need</h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>A dish that demonstrates nutritional balance (Healthy Plate principles)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Clear allergen identification and safe preparation practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Sustainable ingredient sourcing (seasonal, low-waste approach)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Professional presentation and creativity</span>
              </li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-slate-500 mb-4">
              Register your interest now to receive entry requirements, challenge details, and exclusive competition updates.
            </p>
            <a
              href="mailto:info@culinarymedicineuk.org?subject=Competition%202027%20Registration%20of%20Interest&body=Hi%2C%0A%0AI%20am%20interested%20in%20registering%20for%20the%20Healthy%20Plate%2C%20Healthy%20Planet%20Competition%202027.%0A%0APlease%20send%20me%20the%20entry%20requirements%20and%20updates.%0A%0AThank%20you."
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              📧 Register Interest
            </a>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400">
              By registering, you'll receive exclusive competition updates and entry requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
