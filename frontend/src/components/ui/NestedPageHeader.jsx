import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function NestedPageHeader({ title, subtitle, onBack }) {
  return (
    <header className="px-5 pt-5 pb-4 flex items-center gap-3" data-testid="nested-page-header">
      <button
        type="button"
        aria-label="رجوع"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white/5 grid place-items-center text-cream hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={21} />
      </button>
      <div className="min-w-0">
        <h1 className="text-2xl font-black text-cream">{title}</h1>
        {subtitle && <p className="text-xs text-cream/45 font-bold mt-0.5">{subtitle}</p>}
      </div>
    </header>
  );
}
