import React, { useState } from 'react';
import { AllergenCheckboxes } from '../components/AllergenCheckboxes';

export function OptInPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [hasAllergens, setHasAllergens] = useState<boolean | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAllergenToggle = (allergen: string, checked: boolean) => {
    setSelectedAllergens(prev =>
      checked 
        ? [...prev, allergen] 
        : prev.filter(a => a !== allergen)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate
    if (!firstName.trim() || !email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setLoading(false);
      return;
    }

    if (hasAllergens === null) {
      setMessage({ type: 'error', text: 'Please select Yes or No for allergens.' });
      setLoading(false);
      return;
    }

    if (hasAllergens && selectedAllergens.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one allergen, or choose "No".' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          has_allergens: hasAllergens,
          allergens: selectedAllergens,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Check your email to confirm!' });
        // Clear form fields but keep data for user
        setFirstName('');
        setEmail('');
        setHasAllergens(null);
        setSelectedAllergens([]);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="CMUK Logo" 
            className="h-16 mx-auto mb-3 object-contain"
          />
          <h1 className="text-2xl font-black text-brand-green">Fuel Your Future</h1>
          <p className="text-sm text-slate-500 mt-1">Join the Culinary Medicine UK community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-bold text-brand-green mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition"
              placeholder="Your first name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-brand-green mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-green mb-2">
              Do you have any food allergens? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setHasAllergens(true)}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition ${
                  hasAllergens === true 
                    ? 'bg-brand-orange text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasAllergens(false)}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition ${
                  hasAllergens === false 
                    ? 'bg-brand-green text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {hasAllergens && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-brand-green mb-1">
                Select your allergens <span className="text-red-500">*</span>
              </label>
              <AllergenCheckboxes 
                selectedAllergens={selectedAllergens} 
                onChange={handleAllergenToggle} 
              />
              <p className="text-xs text-slate-400 italic">
                Select all that apply. You won't see this list again.
              </p>
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>

          <p className="text-[10px] text-slate-400 text-center mt-4">
            We'll never share your information. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
