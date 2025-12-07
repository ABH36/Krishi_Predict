import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, Activity, ChevronDown, Check, Calculator, Sprout, Coins } from 'lucide-react';

const ProfitSimulator = ({ lang, predictedPrice }) => {
  // predictedPrice hum parent se lenge (AI wala bhav)
  const safePrice = predictedPrice || 2000; 

  const [crop, setCrop] = useState('wheat');
  const [acres, setAcres] = useState(1);
  const [showResult, setShowResult] = useState(false);

  // --- CUSTOM DROPDOWN STATE ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = lang === 'hi' ? {
    title: "स्मार्ट मुनाफा कैलकुलेटर",
    subtitle: "अपनी संभावित कमाई का अनुमान लगाएं",
    crop: "फसल चुनें",
    area: "खेत का क्षेत्रफल (एकड़)",
    btn: "मुनाफा चेक करें",
    revenue: "कुल कमाई (अनुमानित)",
    cost: "कुल लागत (बीज + खाद)",
    net: "शुद्ध मुनाफा (Net Profit)",
    quintal: "क्विंटल",
    crops: {
      wheat: "गेहूँ (Wheat)",
      rice: "धान (Rice)",
      garlic: "लहसुन (Garlic)",
      onion: "प्याज़ (Onion)",
      potato: "आलू (Potato)",
      tomato: "टमाटर (Tomato)"
    }
  } : {
    title: "Smart Profit Simulator",
    subtitle: "Estimate your potential net income",
    crop: "Select Crop",
    area: "Farm Area (Acres)",
    btn: "Calculate ROI",
    revenue: "Total Revenue (Est)",
    cost: "Total Input Cost",
    net: "Net Profit",
    quintal: "Quintal",
    crops: {
      wheat: "Wheat",
      rice: "Rice",
      garlic: "Garlic",
      onion: "Onion",
      potato: "Potato",
      tomato: "Tomato"
    }
  };

  const cropList = ['wheat', 'rice', 'garlic', 'onion', 'potato', 'tomato'];

  const cropData = {
    wheat: { yield: 20, cost: 12000 },
    rice: { yield: 25, cost: 15000 },
    garlic: { yield: 40, cost: 40000 },
    onion: { yield: 100, cost: 25000 },
    potato: { yield: 120, cost: 30000 },
    tomato: { yield: 150, cost: 35000 }
  };

  const calculateProfit = () => {
    setShowResult(true);
  };

  const data = cropData[crop] || cropData.wheat;
  
  const totalYield = data.yield * acres;
  const totalRevenue = totalYield * safePrice;
  const totalCost = data.cost * acres;
  const netProfit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(0) : 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
           <PieChart size={100} />
        </div>
        <div className="relative z-10 flex items-center gap-3">
           <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
              <Calculator size={24} className="text-white" />
           </div>
           <div>
             <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
             <p className="text-indigo-100 text-sm font-medium opacity-90">{t.subtitle}</p>
           </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* --- INPUTS CONTAINER --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          
          {/* Custom Crop Dropdown */}
          <div className="w-full md:w-1/2 relative group" ref={dropdownRef}>
             <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Sprout size={14} className="text-indigo-600"/> {t.crop}
             </label>
             
             <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-4 flex justify-between items-center border rounded-xl bg-slate-50 text-slate-700 font-semibold transition-all duration-200 outline-none
                    ${isDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white' : 'border-slate-200 hover:border-indigo-400 hover:bg-white'}
                `}
             >
                <span className="truncate">{t.crops[crop]}</span>
                <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
             </button>

             {/* Dropdown Options */}
             {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-indigo-900/10 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-[fadeIn_0.2s_ease-out]">
                   {cropList.map((key) => (
                      <button
                         key={key}
                         type="button"
                         onClick={() => {
                            setCrop(key);
                            setIsDropdownOpen(false);
                         }}
                         className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-slate-50 last:border-0
                            ${crop === key ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                         `}
                      >
                         {t.crops[key]}
                         {crop === key && <Check size={16} className="text-indigo-600"/>}
                      </button>
                   ))}
                </div>
             )}
          </div>

          {/* Acres Input */}
          <div className="w-full md:w-1/2">
             <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Activity size={14} className="text-indigo-600"/> {t.area}
             </label>
             <div className="relative">
                <input 
                  type="number" 
                  min="0.5" 
                  step="0.5"
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none bg-slate-100 px-2 py-1 rounded">
                   ACRES
                </div>
             </div>
          </div>
        </div>

        <button 
          onClick={calculateProfit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
        >
          <Calculator size={20} /> {t.btn}
        </button>

        {/* --- RESULTS --- */}
        {showResult && (
          <div className="mt-8 space-y-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm font-semibold text-slate-400 uppercase tracking-widest">Financial Breakdown</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Revenue Card */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center group hover:shadow-md transition-all">
                    <div>
                       <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">{t.revenue}</p>
                       <p className="text-[10px] text-emerald-500/80 font-medium">@ ₹{safePrice}/{t.quintal}</p>
                    </div>
                    <p className="text-xl font-black text-emerald-700">+₹{totalRevenue.toLocaleString()}</p>
                </div>

                {/* Cost Card */}
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex justify-between items-center group hover:shadow-md transition-all">
                    <div>
                       <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">{t.cost}</p>
                       <p className="text-[10px] text-rose-500/80 font-medium">Estimated Input</p>
                    </div>
                    <p className="text-xl font-black text-rose-700">-₹{totalCost.toLocaleString()}</p>
                </div>
            </div>

            {/* Net Profit Card (Main Highlight) */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden group">
               {/* Background Pattern */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
               
               <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
                            <Coins size={18} />
                        </div>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">{t.net}</p>
                    </div>
                    <h3 className="text-4xl font-black tracking-tight text-white">
                        ₹{netProfit.toLocaleString()}
                    </h3>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">ROI Analysis</p>
                    <div className={`text-2xl font-bold ${roi > 0 ? 'text-emerald-400' : 'text-red-400'} flex items-center justify-end gap-1`}>
                        <TrendingUp size={20} className={roi > 0 ? '' : 'rotate-180'} />
                        {roi}%
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitSimulator;