import React, { useState } from 'react';
import { motion } from 'motion/react';
import Mascot from '../components/mascot/Mascot';
import { api } from '../lib/api';
import { burst } from '../lib/confetti';

// 3-step onboarding: choose companion → NAME it (naming = attachment) →
// set the savings goal. Slide transitions use y/opacity (RTL-safe).
const NAME_SUGGESTIONS = ['صقر', 'سعود', 'رزين', 'وفرة'];
const GOAL_PRESETS = [5000, 10000, 20000];

const COMPANIONS = [
  { id: 'falcon', name: 'صقر', available: true },
  { id: 'camel', name: 'جمل', available: false },
  { id: 'cat', name: 'قط', available: false },
];

export default function OnboardingFlow({ onDone }) {
  const [step, setStep] = useState(0);
  const [petName, setPetName] = useState('');
  const [goal, setGoal] = useState(5000);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    try {
      await api.setProfile({ petName: petName || 'صقر', petType: 'falcon', goalAmount: goal });
    } catch { /* offline demo still proceeds */ }
    burst();
    localStorage.setItem('amad_onboarded', '1');
    setTimeout(onDone, 600);
  };

  return (
    <div className="bg-gradient-to-b from-ink-soft to-ink h-full overflow-y-auto flex flex-col font-sans" dir="rtl">
      {/* progress dots */}
      <div className="flex justify-center gap-2 pt-8">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-coral' : 'w-2 bg-white/20'}`} />
        ))}
      </div>

      {/* Keyed motion.div (no AnimatePresence): each step enters on mount.
          mode="wait" deadlocked its exit animation under React 19 — the new
          step never entered. Keyed swap animates in cleanly without exit. */}
      <motion.div
          key={step}
          className="flex-1 flex flex-col items-center px-6 pt-6 pb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <>
              <h1 className="text-2xl font-black text-cream text-center">اختر مرافقك المالي</h1>
              <p className="text-sm text-cream/50 mt-2 text-center font-medium">يعيش معك، يفرح لما توفر، ويتعب لما تسرف</p>
              <div className="mt-8">
                <Mascot emotion="happy" stage={1} size={190} />
              </div>
              <div className="flex gap-3 mt-6">
                {COMPANIONS.map((c) => (
                  <button
                    key={c.id}
                    disabled={!c.available}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm border-2 ${
                      c.available
                        ? 'bg-white border-coral text-ink shadow-md scale-105'
                        : 'bg-white/5 border-white/10 text-cream/30'
                    }`}
                  >
                    {c.name}
                    {!c.available && <span className="block text-[9px] mt-0.5">قريبًا</span>}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-auto w-full bg-coral text-ink font-black py-4 rounded-2xl shadow-lg shadow-coral/20 active:scale-95 transition-transform">
                أبيه!
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-black text-cream text-center">سمِّه على كيفك</h1>
              <p className="text-sm text-cream/50 mt-2 text-center font-medium">الاسم يخليه صديقك مو مجرد تطبيق</p>
              <div className="mt-6">
                <Mascot emotion={petName ? 'happy' : 'idle'} stage={1} size={160} />
              </div>
              <input
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="اكتب اسمه…"
                maxLength={20}
                className="mt-6 w-full text-center text-2xl font-black bg-white/10 text-cream placeholder:text-cream/30 border-2 border-white/15 focus:border-coral rounded-2xl py-4 outline-none"
              />
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {NAME_SUGGESTIONS.map((n) => (
                  <button key={n} onClick={() => setPetName(n)} className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-sm font-bold text-cream/80 hover:border-coral">
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!petName.trim()}
                className="mt-auto w-full bg-coral disabled:bg-white/10 disabled:text-cream/30 text-ink font-black py-4 rounded-2xl shadow-lg shadow-coral/20 active:scale-95 transition-transform"
              >
                يلا نكمل
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-black text-cream text-center">حدد هدف ادخارك</h1>
              <p className="text-sm text-cream/50 mt-2 text-center font-medium">{petName || 'مرافقك'} يكبر كل ما اقتربت من هدفك 🥚←🐤←🦅</p>
              <div className="mt-6">
                <Mascot emotion="celebrating" stage={0} size={150} />
              </div>
              <div className="text-4xl font-black text-coral mt-6">{goal.toLocaleString('ar-SA')} <span className="text-base text-cream/40">ر.س</span></div>
              <input
                type="range" min="1000" max="50000" step="500" value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full mt-4 accent-[#F0846A]"
              />
              <div className="flex gap-2 mt-4">
                {GOAL_PRESETS.map((g) => (
                  <button key={g} onClick={() => setGoal(g)} className={`px-4 py-2 rounded-full text-sm font-bold border ${goal === g ? 'bg-coral text-ink border-coral' : 'bg-white/10 border-white/10 text-cream/70'}`}>
                    {g.toLocaleString('ar-SA')}
                  </button>
                ))}
              </div>
              <button
                onClick={finish}
                disabled={saving}
                className="mt-auto w-full bg-coral disabled:opacity-60 text-ink font-black py-4 rounded-2xl shadow-lg shadow-coral/20 active:scale-95 transition-transform"
              >
                {saving ? '…' : `ابدأ الرحلة مع ${petName || 'مرافقك'} 🚀`}
              </button>
            </>
          )}
        </motion.div>
    </div>
  );
}
