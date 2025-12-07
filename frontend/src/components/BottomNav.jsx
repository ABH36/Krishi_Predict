import React from 'react';
import { Home, CloudSun, ShoppingBag, User, Sprout, LayoutDashboard } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, role }) => {
  
  // 1. Farmer Tabs
  const farmerNav = [
    { id: 'home', label: 'Home', icon: <Home size={22} /> },
    { id: 'mandi', label: 'Mandi', icon: <ShoppingBag size={22} /> },
    { id: 'predict', label: 'Predict', icon: <div className="bg-green-600 p-3 rounded-full shadow-lg shadow-green-500/40 text-white -mt-6 border-4 border-white"><Sprout size={24} /></div>, isFloating: true },
    { id: 'weather', label: 'Weather', icon: <CloudSun size={22} /> },
    { id: 'profile', label: 'Profile', icon: <User size={22} /> },
  ];

  // 2. Trader Tabs (Simplified)
  const traderNav = [
    { id: 'home', label: 'Market', icon: <LayoutDashboard size={22} /> },
    { id: 'profile', label: 'Profile', icon: <User size={22} /> },
  ];

  const navItems = role === 'trader' ? traderNav : farmerNav;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50 md:hidden pb-safe animate-slide-up">
      <div className="flex justify-around items-center px-2 py-2">
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          // Floating Button Logic (Sirf Farmer ke liye)
          if (item.isFloating) {
            return (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center justify-center group"
              >
                <div className={`transform transition-transform duration-200 ${isActive ? 'scale-110' : 'active:scale-95'}`}>
                   {item.icon}
                </div>
                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          // Normal Buttons
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 active:scale-95 transition-transform"
            >
              <div className={`transition-colors duration-300 ${isActive ? (role === 'trader' ? 'text-indigo-600' : 'text-green-600') : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? (role === 'trader' ? 'text-indigo-700 font-bold' : 'text-green-700 font-bold') : 'text-gray-400'}`}>
                {item.label}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className={`absolute top-0 w-8 h-1 rounded-b-full shadow-sm ${role === 'trader' ? 'bg-indigo-500 shadow-indigo-200' : 'bg-green-500 shadow-green-200'}`}></div>
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default BottomNav;