import React from 'react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';

export default function StagedProgress({ steps, activeIndex, testId, showStageCount = false, supportingText = null }) {
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);
  return (
    <div aria-busy="true" data-testid={testId}>
      <div className="flex items-center gap-3">
        <LoaderCircle className="text-coral animate-spin motion-reduce:animate-none shrink-0" size={25} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-[10px] text-cream/40 font-bold">
            <p>جاري المعالجة · {progress}%</p>
            {showStageCount && <p className="text-coral" data-testid={`${testId}-stage-count`}>{activeIndex + 1} من {steps.length}</p>}
          </div>
          <p className="font-black text-sm mt-0.5" aria-live="polite" data-testid={`${testId}-stage`}>{steps[activeIndex]}</p>
          {supportingText && <p className="text-[10px] text-cream/45 font-medium mt-1">{supportingText}</p>}
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-4" role="progressbar" aria-label="التقدم الكلي" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
        <div className="h-full bg-coral rounded-full transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>
      <ol className="space-y-1.5 mt-4">
        {steps.map((step, index) => (
          <li key={step} className={`flex items-center gap-2 text-[10px] font-bold ${index <= activeIndex ? 'text-cream/75' : 'text-cream/30'}`}>
            {index < activeIndex
              ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              : <span className={`w-[13px] h-[13px] rounded-full border shrink-0 ${index === activeIndex ? 'border-coral bg-coral/20' : 'border-white/15'}`} />}
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
