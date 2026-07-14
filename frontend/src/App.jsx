import React from 'react';
import { Wifi } from 'lucide-react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import HomeView from './views/HomeView';
import PetRoomView from './views/PetRoomView';
import RewardsView from './views/RewardsView';
import NotificationsView from './views/NotificationsView';
import FamilyGoalView from './views/FamilyGoalView';
import OpportunitiesView from './views/OpportunitiesView';
import TransactionsView from './views/TransactionsView';
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

// Shell only: device frame, view switching, and celebrations.
// The operator/judge control panel is the standalone Cheat Controller served
// by the backend at http://localhost:3000/ — no in-app PoC panel.
function AppShell() {
  const { loading, activeView, setActiveView, user, game, savingsAccountOpened, demoResetVersion } = useAppData();

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
            <React.Fragment key={demoResetVersion}>
                {activeView === 'home' && <HomeView />}
                {activeView === 'pet' && savingsAccountOpened && <PetRoomView />}
                {activeView === 'rewards' && <RewardsView />}
                {activeView === 'family' && <FamilyGoalView />}
                {activeView === 'opportunities' && <OpportunitiesView />}
                {activeView === 'transactions' && <TransactionsView />}
                {activeView === 'notifications' && <NotificationsView setActiveView={setActiveView} />}
                {!['notifications', 'transactions'].includes(activeView) && (
                  <BottomNav activeView={activeView} setActiveView={setActiveView} petName={user?.petName} petLocked={!savingsAccountOpened} />
                )}
                <RewardNotice />
            </React.Fragment>
          </div>
        </div>
      </div>

      {/* Celebration layer — portal above the frame */}
      <CelebrationOverlay key={demoResetVersion} game={game} petName={user?.petName} />
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
