import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import HomeView from './views/HomeView';
import PetRoomView from './views/PetRoomView';
import RewardsView from './views/RewardsView';
import SimulatorView from './views/SimulatorView';
import OnboardingFlow from './views/OnboardingFlow';
import MascotLab from './views/MascotLab';
import BottomNav from './components/ui/BottomNav';
import CelebrationOverlay from './components/ui/CelebrationOverlay';

// Shell only: device frame, view switching, onboarding gate, celebrations,
// and the demo-operator FAB. All state lives in AppDataContext.
function AppShell() {
  const { loading, activeView, setActiveView, user, game } = useAppData();
  // Onboarding shows once per device (reset with ?onboard=1 for the demo).
  const [onboarded, setOnboarded] = useState(() =>
    Boolean(localStorage.getItem('amad_onboarded')) && !new URLSearchParams(window.location.search).get('onboard')
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-sans" dir="rtl">
        <p className="animate-pulse">جاري الاتصال بالخادم...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-900 flex justify-center overflow-hidden font-sans">
      {/* Mobile Device Frame for Demo */}
      <div className="w-full max-w-md bg-white shadow-2xl relative h-screen overflow-hidden sm:border-x sm:border-gray-800">
        {!onboarded ? (
          <OnboardingFlow onDone={() => setOnboarded(true)} />
        ) : (
          <>
            {activeView === 'home' && <HomeView />}
            {activeView === 'pet' && <PetRoomView />}
            {activeView === 'rewards' && <RewardsView />}
            {activeView === 'simulator' && <SimulatorView />}
            {activeView !== 'simulator' && (
              <BottomNav activeView={activeView} setActiveView={setActiveView} petName={user?.petName} />
            )}
          </>
        )}
      </div>

      {/* Celebration layer — portal above the frame */}
      {onboarded && <CelebrationOverlay game={game} petName={user?.petName} />}

      {/* Persistent Toggle Button for Presentation */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <button
          onClick={() => setActiveView(activeView === 'simulator' ? 'home' : 'simulator')}
          className="bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl border-4 border-alinma hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          {activeView === 'simulator' ? (
            <span className="text-2xl">🐤</span>
          ) : (
            <Settings size={28} className="text-alinma group-hover:rotate-90 transition-transform" />
          )}

          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {activeView === 'simulator' ? 'العودة لتطبيق الإنماء' : 'لوحة تحكم لجنة التحكيم'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Dev review grid for the mascot's emotional range: /?lab=1
  if (new URLSearchParams(window.location.search).get('lab')) {
    return <MascotLab />;
  }
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  );
}
