import React from 'react';
import { Settings } from 'lucide-react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import HomeView from './views/HomeView';
import PetRoomView from './views/PetRoomView';
import SimulatorView from './views/SimulatorView';

// Shell only: device frame, view switching, and the demo-operator FAB.
// All state lives in AppDataContext; all UI lives in views/.
function AppShell() {
  const { loading, activeView, setActiveView, currentPet } = useAppData();
  const CurrentPetGraphic = currentPet.Graphic;

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
        {activeView === 'home' && <HomeView />}
        {activeView === 'pet' && <PetRoomView />}
        {activeView === 'simulator' && <SimulatorView />}
      </div>

      {/* Persistent Toggle Button for Presentation */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <button
          onClick={() => setActiveView(activeView === 'simulator' ? 'home' : 'simulator')}
          className="bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl border-4 border-emerald-500 hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          {activeView === 'simulator' ? (
            <div className="w-10 h-10 transform scale-110"><CurrentPetGraphic /></div>
          ) : (
            <Settings size={28} className="text-emerald-400 group-hover:rotate-90 transition-transform" />
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
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  );
}
