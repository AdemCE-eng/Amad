import React, { useState } from 'react';
import Mascot from '../components/mascot/Mascot';
import { EMOTIONS } from '../components/mascot/emotions';

const LABELS = {
  idle: 'هادئ', radiant: 'متألق', happy: 'سعيد', celebrating: 'يحتفل', eating: 'يأكل',
  tired: 'متعب', sad: 'حزين', crying: 'يبكي', sick: 'مريض', sleeping: 'نائم',
};

// Dev-only review grid (open with ?lab=1): every emotion × the stage/
// accessory controls, for the team cuteness checkpoints. Not linked from
// the app UI.
export default function MascotLab() {
  const [stage, setStage] = useState(1);
  const [equipped, setEquipped] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans" dir="rtl">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-black text-slate-800">مختبر المرافق 🧪</h1>
        <div className="flex gap-2">
          {[0, 1, 2].map((s) => (
            <button
              key={s} onClick={() => setStage(s)}
              className={`px-4 py-2 rounded-xl font-bold text-sm ${stage === s ? 'bg-alinma text-white' : 'bg-white text-slate-600'}`}
            >
              {['بيضة', 'فرخ', 'صقر'][s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[[null, 'بدون'], ['shemagh', 'شماغ'], ['sunglasses', 'نظارة'], ['falcon_hood', 'برقع']].map(([id, label]) => (
            <button
              key={label} onClick={() => setEquipped(id)}
              className={`px-4 py-2 rounded-xl font-bold text-sm ${equipped === id ? 'bg-coin text-white' : 'bg-white text-slate-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(EMOTIONS).map((emotion) => (
          <div key={emotion} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
            <Mascot emotion={emotion} stage={stage} equipped={equipped} size={170} track={emotion === 'idle'} />
            <span className="mt-2 font-bold text-slate-700">{LABELS[emotion]} <span className="text-slate-400 text-xs">({emotion})</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
