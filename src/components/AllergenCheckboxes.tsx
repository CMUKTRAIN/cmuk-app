import React from 'react';

interface AllergenCheckboxesProps {
  selectedAllergens: string[];
  onChange: (allergen: string, checked: boolean) => void;
}

const ALLERGENS = [
  'Celery',
  'Cereals containing gluten — wheat, rye, barley and oats',
  'Crustaceans — such as prawns, crabs and lobster',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs — such as mussels, oysters and squid',
  'Mustard',
  'Nuts — almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios and macadamia nuts',
  'Peanuts',
  'Sesame',
  'Soya',
  'Sulphur dioxide and sulphites'
];

export function AllergenCheckboxes({ selectedAllergens, onChange }: AllergenCheckboxesProps) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-3 bg-slate-50/30">
      {ALLERGENS.map((allergen) => (
        <label key={allergen} className="flex items-start gap-2.5 text-sm text-slate-700 hover:text-brand-green cursor-pointer py-1 px-1 rounded transition">
          <input
            type="checkbox"
            checked={selectedAllergens.includes(allergen)}
            onChange={(e) => onChange(allergen, e.target.checked)}
            className="mt-0.5 w-4 h-4 text-brand-orange border-slate-300 rounded focus:ring-brand-orange focus:ring-2 cursor-pointer"
          />
          <span className="leading-tight">{allergen}</span>
        </label>
      ))}
    </div>
  );
}
