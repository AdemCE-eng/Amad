import React, { useState, useEffect } from 'react';
import { 
  Bell, Menu, ChevronLeft, ShieldAlert, Coffee, 
  ShoppingCart, Zap, HeartPulse, Shield, ArrowLeftRight, Settings
} from 'lucide-react';

const customStyles = `
  @keyframes shakeScreen {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-8px) rotate(-2deg); }
    50% { transform: translateX(8px) rotate(2deg); }
    75% { transform: translateX(-8px) rotate(-2deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes sickDrop {
    0% { transform: rotate(0deg) translateY(0); filter: grayscale(0); }
    100% { transform: rotate(90deg) translateY(20px); filter: grayscale(0.8); }
  }
  @keyframes happyJump {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.1); }
  }
  .animate-screen-shake {
    animation: shakeScreen 0.4s ease-in-out;
  }
  
  /* Pet States */
  .pet-normal {
    animation: breathe 3s infinite ease-in-out;
  }
  .pet-sick {
    animation: sickDrop 0.5s forwards ease-in-out;
  }
  .pet-happy {
    animation: happyJump 1s infinite ease-in-out;
    filter: drop-shadow(0 0 15px rgba(52, 211, 153, 0.6));
  }
  .pet-shielded {
    animation: breathe 4s infinite ease-in-out;
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
  }
  .pet-squish {
    transform: scale(1.1, 0.85) translateY(10px) !important;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// قمنا بتصميم هذه الشخصيات كفيكتور مدمج لضمان عملها كأصل من أصول اللعبة دون الحاجة لروابط إنترنت
const PetGraphics = {
  falcon: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="45" fill="#f59e0b" /> {/* Body */}
      <circle cx="50" cy="45" r="35" fill="#fef3c7" /> {/* Face area */}
      <path d="M 40 40 Q 50 30 60 40" fill="none" stroke="#92400e" strokeWidth="4" strokeLinecap="round" /> {/* Brow */}
      <circle cx="35" cy="50" r="6" fill="#1e293b" /> {/* Left Eye */}
      <circle cx="65" cy="50" r="6" fill="#1e293b" /> {/* Right Eye */}
      <path d="M 45 55 L 55 55 L 50 65 Z" fill="#ea580c" /> {/* Beak */}
      <path d="M 10 40 Q 20 60 15 80" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" /> {/* Left Wing */}
      <path d="M 90 40 Q 80 60 85 80" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" /> {/* Right Wing */}
    </svg>
  ),
  camel: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <path d="M 20 70 Q 35 20 50 70 Q 65 20 80 70 Z" fill="#d97706" /> {/* Humps */}
      <circle cx="50" cy="65" r="30" fill="#f59e0b" /> {/* Body */}
      <circle cx="75" cy="45" r="20" fill="#f59e0b" /> {/* Head */}
      <circle cx="70" cy="40" r="4" fill="#1e293b" /> {/* Eye */}
      <path d="M 85 45 Q 95 45 90 55" fill="none" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" /> {/* Snout */}
      <path d="M 30 90 L 30 75 M 50 90 L 50 85 M 70 90 L 70 75" stroke="#d97706" strokeWidth="8" strokeLinecap="round" /> {/* Legs */}
    </svg>
  ),
  wolf: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="55" r="40" fill="#64748b" /> {/* Body */}
      <circle cx="50" cy="60" r="25" fill="#f1f5f9" /> {/* Snout Area */}
      <path d="M 20 20 L 35 40 L 45 20 Z" fill="#475569" /> {/* Left Ear */}
      <path d="M 80 20 L 65 40 L 55 20 Z" fill="#475569" /> {/* Right Ear */}
      <circle cx="35" cy="45" r="5" fill="#0f172a" /> {/* Left Eye */}
      <circle cx="65" cy="45" r="5" fill="#0f172a" /> {/* Right Eye */}
      <ellipse cx="50" cy="55" rx="8" ry="5" fill="#0f172a" /> {/* Nose */}
    </svg>
  ),
  cat: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="55" r="40" fill="#f97316" /> {/* Body */}
      <path d="M 15 25 L 30 45 L 45 25 Z" fill="#ea580c" /> {/* Left Ear */}
      <path d="M 85 25 L 70 45 L 55 25 Z" fill="#ea580c" /> {/* Right Ear */}
      <circle cx="35" cy="50" r="5" fill="#1c1917" /> {/* Left Eye */}
      <circle cx="65" cy="50" r="5" fill="#1c1917" /> {/* Right Eye */}
      <path d="M 45 60 L 55 60 L 50 65 Z" fill="#fca5a5" /> {/* Nose */}
      <path d="M 20 60 L 35 65 M 20 65 L 35 68 M 20 70 L 35 71" stroke="#fff" strokeWidth="2" strokeLinecap="round" /> {/* Whiskers L */}
      <path d="M 80 60 L 65 65 M 80 65 L 65 68 M 80 70 L 65 71" stroke="#fff" strokeWidth="2" strokeLinecap="round" /> {/* Whiskers R */}
    </svg>
  ),
  bird: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="40" fill="#38bdf8" /> {/* Body */}
      <circle cx="50" cy="55" r="25" fill="#e0f2fe" /> {/* Belly */}
      <circle cx="35" cy="40" r="5" fill="#0f172a" /> {/* Left Eye */}
      <circle cx="65" cy="40" r="5" fill="#0f172a" /> {/* Right Eye */}
      <path d="M 40 50 L 60 50 L 50 60 Z" fill="#facc15" /> {/* Beak */}
      <path d="M 10 50 Q 0 60 15 70" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" /> {/* Left Wing */}
      <path d="M 90 50 Q 100 60 85 70" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" /> {/* Right Wing */}
    </svg>
  )
};

export default function App() {
  const [activeView, setActiveView] = useState('mobile_home'); 
  
  const [balance, setBalance] = useState(12450.50);
  const [savings, setSavings] = useState(340.25);
  const [mokafaaPoints, setMokafaaPoints] = useState(1250);
  
  const [petType, setPetType] = useState('falcon');
  const [isPetted, setIsPetted] = useState(false); // Touch interaction state
  
  const [petState, setPetState] = useState({
    level: 3,
    xp: 65,
    mood: 'happy', // 'happy', 'tired', 'shielded'
    health: 100
  });

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'ستاربكس', category: 'coffee', amount: 18.50, roundUp: 0.50, date: 'اليوم، 09:30 ص' },
    { id: 2, title: 'أسواق التميمي', category: 'groceries', amount: 145.00, roundUp: 0.00, date: 'أمس، 08:15 م' },
  ]);

  // Gamification Effects
  const [isShaking, setIsShaking] = useState(false);
  const [flashColor, setFlashColor] = useState(null);

  const PET_TYPES = {
    falcon: { id: 'falcon', name: 'صقر', Graphic: PetGraphics.falcon },
    camel: { id: 'camel', name: 'جمل', Graphic: PetGraphics.camel },
    wolf: { id: 'wolf', name: 'ذئب', Graphic: PetGraphics.wolf },
    cat: { id: 'cat', name: 'قط', Graphic: PetGraphics.cat },
    bird: { id: 'bird', name: 'طائر', Graphic: PetGraphics.bird }
  };

  const currentPet = PET_TYPES[petType];
  const CurrentPetGraphic = currentPet.Graphic;

  const isSick = petState.health <= 40 || petState.mood === 'tired';
  const isHappy = petState.health >= 80 && petState.mood !== 'shielded';

  const triggerScreenShake = () => {
    setIsShaking(true);
    setFlashColor('rgba(239, 68, 68, 0.2)'); // Red Damage Flash
    setTimeout(() => {
      setIsShaking(false);
      setFlashColor(null);
    }, 400);
  };

  const triggerHappyFlash = () => {
    setFlashColor('rgba(16, 185, 129, 0.2)'); // Green Heal Flash
    setTimeout(() => setFlashColor(null), 400);
  };

  // Squish animation on tap (No stats change, just visual interaction)
  const handlePetInteraction = () => {
    if (isSick) return; // Don't interact if sick
    setIsPetted(true);
    setTimeout(() => setIsPetted(false), 200); // Remove squish after 200ms
  };

  const getPetMessage = () => {
    if (petState.mood === 'shielded') return `درع الطوارئ مفعل! استخدام المدخرات للضرورة هو قرار حكيم. أنا محمي ولن أفقد طاقتي.`;
    if (isSick) return `أشعر بالمرض الشديد والإرهاق.. 🤒 لقد استنزفنا الميزانية بشكل سيء. أرجوك، نحتاج إلى التوفير لكي أستعيد عافيتي وأنهض مجدداً!`;
    if (isHappy) return `أنا في قمة نشاطي وسعادتي! ✨ أداؤك المالي المذهل يمدني بطاقة هائلة. لنواصل هذا الإنجاز الرائع!`;
    return `أداؤك المالي مستقر! لقد وفرنا مبالغ جيدة. استمر حتى نصل للمستوى التالي!`;
  };

  const getPetAnimationClass = () => {
    let animClass = 'pet-normal';
    if (isSick) animClass = 'pet-sick';
    else if (petState.mood === 'shielded') animClass = 'pet-shielded';
    else if (isHappy) animClass = 'pet-happy';

    if (isPetted) return `${animClass} pet-squish`;
    return animClass;
  };

  const MobileHome = () => (
    <div className={`bg-gray-50 min-h-screen flex flex-col font-sans transition-all duration-300 ${isShaking ? 'animate-screen-shake' : ''}`} dir="rtl">
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none transition-colors duration-300" style={{ backgroundColor: flashColor }}></div>}
      
      {/* Header */}
      <div className="bg-[#8c5e3c] text-white p-4 flex justify-between items-center rounded-b-2xl shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg"><Menu size={24} /></div>
          <h1 className="text-xl font-bold tracking-wider">alinma <span className="font-light">الإنماء</span></h1>
        </div>
        <div className="relative bg-white/20 p-2 rounded-lg">
          <Bell size={24} />
          <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-24 z-10">
        {/* Welcome & Balance Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">مرحباً بك، عبدالله</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-400 mb-1">الحساب الجاري المتميز</p>
              <h2 className="text-3xl font-bold text-[#8c5e3c]">{balance.toFixed(2)} <span className="text-sm text-gray-500">ر.س</span></h2>
            </div>
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=8c5e3c`} alt="avatar" className="w-12 h-12 rounded-full border-2 border-[#8c5e3c]" />
          </div>
        </div>

        {/* --- DYNAMIC WIDGET --- */}
        <div 
          onClick={() => setActiveView('mobile_pet')}
          className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            isSick ? 'bg-red-50 border-red-300 shadow-red-100' : 
            petState.mood === 'shielded' ? 'bg-blue-50 border-blue-300 shadow-blue-100' : 
            isHappy ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-green-100' :
            'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300 shadow-amber-100'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 flex items-center justify-center rounded-full border-2 overflow-hidden bg-white/80 p-1 ${
                isSick ? 'border-red-400' : petState.mood === 'shielded' ? 'border-blue-400' : 'border-[#8c5e3c]'
              }`}>
                <div className={`w-full h-full transform ${isSick ? 'grayscale opacity-70 rotate-90 scale-90' : ''}`}>
                  <CurrentPetGraphic />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">مرافقك: {currentPet.name}</h3>
                <div className="flex items-center gap-1 text-xs font-bold mt-1">
                  <HeartPulse size={12} className={isSick ? 'text-red-500' : 'text-green-500'} />
                  <span className={isSick ? 'text-red-600' : 'text-green-600'}>{petState.health}% صحة</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-100">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Level</span>
              <span className="block text-xl font-black text-[#8c5e3c]">{petState.level}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed mb-4 font-medium italic">
            "{getPetMessage()}"
          </p>

          {/* XP Bar */}
          <div className="w-full bg-white/60 rounded-full h-3 mb-1 overflow-hidden border border-gray-200">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${isSick ? 'bg-red-400' : 'bg-amber-500'}`}
              style={{ width: `${petState.xp}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500 text-left font-bold">{petState.xp}/100 XP</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {['التحويل', 'سداد الفواتير', 'البطاقات', 'التمويل'].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-[#8c5e3c] border border-gray-100">
                <ArrowLeftRight size={20} />
              </div>
              <span className="text-xs text-gray-600 font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 px-1">أحدث العمليات</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${tx.category === 'emergency' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
                    {tx.category === 'coffee' ? <Coffee size={20} /> : tx.category === 'emergency' ? <ShieldAlert size={20} /> : <ShoppingCart size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{tx.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <p className="font-bold text-gray-800 text-sm">{tx.amount.toFixed(2)}-</p>
                  {tx.roundUp > 0 && (
                    <p className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-green-100">
                      وفرت {tx.roundUp.toFixed(2)} ر.س
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const MobilePetPage = () => (
    <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
      isSick ? 'from-red-50 to-gray-100' : petState.mood === 'shielded' ? 'from-blue-50 to-slate-100' : 'from-amber-50 to-orange-50'
    } min-h-screen flex flex-col font-sans transition-colors duration-500`} dir="rtl">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between z-20">
        <button onClick={() => setActiveView('mobile_home')} className="bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-gray-700 hover:bg-white transition-all">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg tracking-wide">مرافقي المالي</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto pb-24 z-10">
        
        {/* --- MAIN INTERACTIVE PET AREA --- */}
        <div 
          className="relative w-56 h-56 mb-6 flex items-center justify-center mt-4 cursor-pointer group"
          onClick={handlePetInteraction}
        >
          {/* Background Glow */}
          <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
            isSick ? 'bg-red-400/40 animate-pulse' : 
            petState.mood === 'shielded' ? 'bg-blue-400/40 animate-pulse' : 
            isHappy ? 'bg-yellow-400/60 animate-[spin_4s_linear_infinite]' :
            'bg-amber-300/40 animate-pulse'
          }`}></div>

          {/* The Pet Character Frame */}
          <div className={`relative z-10 w-48 h-48 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${
            isSick ? 'border-4 border-red-400' : 
            petState.mood === 'shielded' ? 'border-4 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 
            isHappy ? 'border-4 border-green-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]' :
            'border-4 border-amber-400'
          }`}>
            
            {/* The Actual Real Graphic (SVG) */}
            <div className={`w-32 h-32 select-none pointer-events-none transition-all duration-500 transform ${getPetAnimationClass()} group-hover:scale-105`}>
              <CurrentPetGraphic />
            </div>

            {/* Status Icons overlay */}
            {isSick && <span className="absolute -top-4 -right-4 text-4xl animate-bounce drop-shadow-lg">🤒</span>}
            {isHappy && <span className="absolute -top-4 -right-4 text-4xl animate-ping drop-shadow-lg">✨</span>}
            {petState.mood === 'shielded' && <Shield className="absolute inset-0 m-auto text-blue-500/20 w-40 h-40 animate-pulse pointer-events-none" />}
          </div>

          {/* Health Badge Overlay */}
          <div className="absolute -bottom-2 bg-white px-4 py-2 rounded-full shadow-xl border-2 border-gray-100 flex items-center gap-2 z-20">
            <HeartPulse size={20} className={isSick ? 'text-red-500 animate-pulse' : 'text-green-500'} />
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${isSick ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${petState.health}%` }}></div>
            </div>
            <span className={`text-sm font-black ${isSick ? 'text-red-600' : 'text-green-600'}`}>{petState.health}%</span>
          </div>
        </div>

        {/* GenAI Chat Bubble */}
        <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/50 w-full mb-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/90 rotate-45 border-t border-l border-white/50"></div>
          <p className="text-center text-gray-800 leading-relaxed relative z-10 font-bold">
            "{getPetMessage()}"
          </p>
        </div>

        {/* --- PET SELECTOR (STORE) --- */}
        <div className="w-full bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-white/50 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">متجر الرفقاء</h3>
            <span className="text-xs text-amber-700 bg-amber-100 border border-amber-200 px-2 py-1 rounded-md font-bold">مفتوح لك</span>
          </div>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.values(PET_TYPES).map((pet) => {
              const Graphic = pet.Graphic;
              return (
                <button 
                  key={pet.id}
                  onClick={() => setPetType(pet.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[70px] border-2 ${
                    petType === pet.id 
                      ? 'bg-amber-50 border-amber-400 shadow-md scale-105' 
                      : 'bg-white border-gray-100 hover:border-amber-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-10 h-10 mb-1 drop-shadow-sm">
                    <Graphic />
                  </div>
                  <span className={`text-[10px] font-bold ${petType === pet.id ? 'text-amber-700' : 'text-gray-500'}`}>
                    {pet.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Progress Card */}
        <div className="w-full bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-[11px] text-gray-500 mb-1 font-bold">إجمالي ما وفرناه بكسور الهلل</p>
              <h3 className="text-2xl font-black text-green-600 drop-shadow-sm">{savings.toFixed(2)} <span className="text-sm">ر.س</span></h3>
            </div>
            <div className="text-left bg-amber-50 p-2 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-700 mb-1 font-bold">نقاط مكافأة</p>
              <h3 className="text-xl font-black text-amber-500">{mokafaaPoints}</h3>
            </div>
          </div>
          
          <div>
             <div className="flex justify-between text-xs mb-2 font-black text-gray-700 uppercase">
               <span>Level {petState.level}</span>
               <span>{petState.xp} / 100 XP</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden border border-gray-300">
               <div className="h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-l from-amber-400 to-orange-500 relative" style={{ width: `${petState.xp}%` }}>
                 <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-white/30 to-transparent"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Emergency Shield Button */}
        <button 
          onClick={() => {
             if(petState.mood !== 'shielded') {
               setPetState({...petState, mood: 'shielded'});
             } else {
               setPetState({...petState, mood: 'happy'});
             }
          }}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border-b-4 active:border-b-0 active:translate-y-1 ${
            petState.mood === 'shielded' 
              ? 'bg-gray-200 text-gray-600 border-gray-300' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-800 shadow-xl shadow-blue-200'
          }`}
        >
          <ShieldAlert size={20} className={petState.mood === 'shielded' ? '' : 'animate-pulse'} />
          {petState.mood === 'shielded' ? 'إلغاء درع الطوارئ' : 'سحب طارئ (تفعيل الدرع)'}
        </button>
        <p className="text-[10px] text-gray-500 mt-3 text-center font-medium">يفعل الدرع مؤقتاً لحماية المرافق من التأثر النفسي عند سحب مبلغ للظروف القاهرة.</p>
      </div>
    </div>
  );

  const SimulatorController = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('coffee');
    const [desc, setDesc] = useState('');

    const handleSimulate = (e) => {
      e.preventDefault();
      if(!amount) return;
      
      const amt = parseFloat(amount);
      let roundUpAmt = 0;
      
      if (Math.ceil(amt) > amt) {
        roundUpAmt = Math.ceil(amt) - amt;
      }

      setBalance(prev => prev - amt);
      if (roundUpAmt > 0) setSavings(prev => prev + roundUpAmt);

      const newTx = {
        id: Date.now(),
        title: desc || (category === 'coffee' ? 'مقهى' : category === 'groceries' ? 'بقالة' : 'طوارئ'),
        category,
        amount: amt,
        roundUp: roundUpAmt,
        date: 'الآن'
      };
      setTransactions([newTx, ...transactions]);

      let newMood = petState.mood;
      let newXp = petState.xp;
      let newLevel = petState.level;
      let newHealth = petState.health;

      // The ONLY place where Health and XP are affected (Financial Actions)
      if (category === 'emergency') {
        newMood = 'shielded';
      } else if (category === 'coffee' && amt > 30) {
        newMood = 'tired';
        newXp = Math.max(0, newXp - 15);
        newHealth = Math.max(0, newHealth - 45); 
        triggerScreenShake(); // Bad Financial Action -> Shake screen
      } else if (category === 'groceries' && amt > 500) {
        newMood = 'tired';
        newHealth = Math.max(0, newHealth - 20);
        triggerScreenShake();
      } else {
        newMood = 'happy';
        newHealth = Math.min(100, newHealth + 25); 
        
        const gainedXp = Math.floor(roundUpAmt * 10);
        newXp += gainedXp > 0 ? gainedXp : 5; 
        triggerHappyFlash(); // Good Financial Action -> Green flash
        
        if (newXp >= 100) {
          newLevel += 1;
          newXp = newXp - 100;
          setMokafaaPoints(prev => prev + 500); 
          newHealth = 100; 
        }
      }

      setPetState({ mood: newMood, xp: newXp, level: newLevel, health: newHealth });
      setAmount('');
      setDesc('');
    };

    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 p-6 font-sans" dir="rtl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
            <Settings className="text-emerald-400" size={28} />
            <h1 className="text-2xl font-bold text-white">لوحة التحكم (PoC Simulator)</h1>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 shadow-xl">
            <h2 className="font-bold text-lg mb-4 text-emerald-400">محاكاة عملية شرائية جديدة</h2>
            <form onSubmit={handleSimulate} className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">المبلغ (ر.س)</label>
                <input 
                  type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  placeholder="مثال: 18.50"
                />
                <p className="text-xs text-slate-500 mt-1">سيتم سحب الكسور التلقائي وإضافته كمدخرات (ونقاط للمرافق).</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">التصنيف</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="coffee">قهوة ومطاعم (تصرف سيء إذا زاد)</option>
                  <option value="groceries">أساسيات ومقاضي (تصرف محايد/جيد)</option>
                  <option value="emergency">حالة طارئة (يفعّل درع الطوارئ)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">اسم التاجر</label>
                <input 
                  type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  placeholder="مثال: هاف مليون"
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl mt-4 transition-transform active:scale-95 flex justify-center items-center gap-2">
                <Zap size={20} />
                تنفيذ المعاملة
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-24">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-1">المدخرات</p>
              <p className="font-bold text-xl text-green-400">{savings.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-1">نقاط مكافأة</p>
              <p className="font-bold text-xl text-amber-400">{mokafaaPoints}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-1">مزاج المرافق</p>
              <p className="font-bold text-lg text-white">{petState.mood}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-1">الصحة / المستوى</p>
              <p className="font-bold text-lg text-white">Lvl {petState.level} ({petState.health}%)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="relative min-h-screen bg-neutral-900 flex justify-center overflow-hidden font-sans">
        
        {/* Mobile Device Frame for Demo */}
        <div className="w-full max-w-md bg-white shadow-2xl relative h-screen overflow-hidden sm:border-x sm:border-gray-800">
          {activeView === 'mobile_home' && <MobileHome />}
          {activeView === 'mobile_pet' && <MobilePetPage />}
          {activeView === 'simulator' && <SimulatorController />}
        </div>

        {/* Persistent Toggle Button for Presentation */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
          <button
            onClick={() => setActiveView(activeView === 'simulator' ? 'mobile_home' : 'simulator')}
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
    </>
  );
}