import React from 'react';
import { Settings, Wifi } from 'lucide-react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import HomeView from './views/HomeView';
import PetRoomView from './views/PetRoomView';
import RewardsView from './views/RewardsView';
import NotificationsView from './views/NotificationsView';
import FamilyGoalView from './views/FamilyGoalView';
import SimulatorView from './views/SimulatorView';
import OnboardingFlow from './views/OnboardingFlow';
import MascotLab from './views/MascotLab';
import BottomNav from './components/ui/BottomNav';
import CelebrationOverlay from './components/ui/CelebrationOverlay';
import RewardNotice from './components/ui/RewardNotice';

// iOS-style status bar rendered inside the device screen (like landing-page
// phone mockups): time on the right in RTL, signal/wifi/battery on the left.
function StatusBar() {
  return (
    <div className="relative h-12 flex items-end justify-between px-8 pb-1.5 text-cream z-[60] select-none" dir="ltr">
      <span className="text-sm font-bold tracking-wide">9:41</span>
      {/* dynamic island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full"></div>
      <div className="flex items-center gap-1.5">
        {/* signal bars */}
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-cream" style={{ height: h }}></span>
          ))}
        </span>
        <Wifi size={15} strokeWidth={2.5} />
        {/* battery */}
        <span className="relative w-6 h-3 rounded-[4px] border border-cream/60">
          <span className="absolute inset-[2px] right-[30%] bg-cream rounded-[2px]"></span>
          <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-cream/60 rounded-r"></span>
        </span>
      </div>
    </div>
  );
}

// Shell only: device frame, view switching, onboarding gate, celebrations,
// and the demo-operator FAB. All state lives in AppDataContext.
function AppShell() {
  const { loading, activeView, setActiveView, user, game, onboarded, setOnboarded } = useAppData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#081521] text-white font-sans" dir="rtl">
        <p className="animate-pulse">جاري الاتصال بالخادم...</p>
      </div>
    );
  }

  return (
    <div className="app-shell relative min-h-screen bg-[#081521] flex items-center justify-center overflow-hidden font-sans py-6">
      {/* ambient page glow behind the device */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-coral/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute w-[720px] h-[720px] rounded-full border border-white/5 pointer-events-none"></div>

      {/* iPhone frame: black bezel, rounded screen, dynamic island */}
      <div className="app-frame relative w-full h-screen sm:h-[min(96vh,1000px)] sm:w-auto sm:aspect-[420/880] bg-black sm:rounded-[3.4rem] sm:p-[10px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] sm:ring-1 sm:ring-white/15">
        <div className="relative w-full h-full bg-ink sm:rounded-[2.8rem] overflow-hidden flex flex-col">
          <StatusBar />
          {/* app viewport — views fill this, nav anchors to it */}
          <div className="relative flex-1 min-h-0">
            {!onboarded ? (
              <OnboardingFlow onDone={() => setOnboarded(true)} />
            ) : (
              <>
                {activeView === 'home' && <HomeView />}
                {activeView === 'pet' && <PetRoomView />}
                {activeView === 'rewards' && <RewardsView />}
                {activeView === 'family' && <FamilyGoalView />}
                {activeView === 'simulator' && <SimulatorView />}
                {activeView === 'notifications' && <NotificationsView setActiveView={setActiveView}/>}
                {activeView !== 'simulator' && (
                  <BottomNav activeView={activeView} setActiveView={setActiveView} petName={user?.petName} />
                )}
                <RewardNotice />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Celebration layer — portal above the frame */}
      {onboarded && <CelebrationOverlay game={game} petName={user?.petName} />}

      {/* Persistent Toggle Button for Presentation */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <button
          onClick={() => setActiveView(activeView === 'simulator' ? 'home' : 'simulator')}
          className="bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl border-4 border-coral hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          {activeView === 'simulator' ? (
            <span className="text-2xl">🐤</span>
          ) : (
            <Settings size={28} className="text-coral group-hover:rotate-90 transition-transform" />
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
