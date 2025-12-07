import React, { useState, useRef, useEffect } from 'react';
import { Beaker, Calculator, ShoppingBag, ChevronDown, Check, Sprout, Coins, Package } from 'lucide-react';

const FertilizerCalculator = ({ lang }) => {
  const [crop, setCrop] = useState('wheat');
  const [acres, setAcres] = useState(1);
  const [result, setResult] = useState(null);
  
  // Custom Dropdown State
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
    title: "खाद कैलकुलेटर",
    subtitle: "सही मात्रा, सही बचत",
    crop_label: "फसल चुनें",
    area_label: "खेत का क्षेत्रफल (एकड़)",
    calc_btn: "लागत निकालें",
    urea: "यूरिया",
    dap: "DAP",
    mop: "MOP (पोटाश)",
    est_cost: "कुल अनुमानित खर्चा",
    bag: "बोरी",
    kg: "किलो",
    note: "*बाजार भाव राज्य अनुसार अलग हो सकते हैं",
    crops: {
      wheat: "गेहूँ (Wheat)",
      rice: "धान (Rice)",
      potato: "आलू (Potato)",
      onion: "प्याज़ (Onion)",
      garlic: "लहसुन (Garlic)",
      tomato: "टमाटर (Tomato)"
    }
  } : {
    title: "Fertilizer Calculator",
    subtitle: "Optimize yield & minimize cost",
    crop_label: "Select Crop",
    area_label: "Land Area (Acres)",
    calc_btn: "Calculate Cost",
    urea: "Urea",
    dap: "DAP",
    mop: "MOP (Potash)",
    est_cost: "Total Estimated Cost",
    bag: "Bags",
    kg: "kg",
    note: "*Market prices may vary by region",
    crops: {
      wheat: "Wheat",
      rice: "Rice",
      potato: "Potato",
      onion: "Onion",
      garlic: "Garlic",
      tomato: "Tomato"
    }
  };

  const cropList = ['wheat', 'rice', 'potato', 'onion', 'garlic', 'tomato'];

  // Standard Logic (kg per acre)
  const cropStandards = {
    wheat: { urea: 110, dap: 50, mop: 30 },
    rice: { urea: 130, dap: 60, mop: 40 },
    potato: { urea: 150, dap: 100, mop: 80 },
    onion: { urea: 100, dap: 60, mop: 50 },
    tomato: { urea: 90, dap: 60, mop: 40 },
    garlic: { urea: 100, dap: 80, mop: 40 }
  };

  const handleCalculate = () => {
    const std = cropStandards[crop] || cropStandards.wheat;
    
    const ureaKg = std.urea * acres;
    const dapKg = std.dap * acres;
    const mopKg = std.mop * acres;

    // Convert to Bags
    const ureaBags = (ureaKg / 45).toFixed(1);
    const dapBags = (dapKg / 50).toFixed(1);
    const mopBags = (mopKg / 50).toFixed(1);

    const cost = Math.round((ureaBags * 266) + (dapBags * 1350) + (mopBags * 1700));

    setResult({
      urea: { kg: ureaKg, bags: ureaBags },
      dap: { kg: dapKg, bags: dapBags },
      mop: { kg: mopKg, bags: mopBags },
      totalCost: cost
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-slate-100 max-w-3xl mx-auto transition-all hover:shadow-2xl hover:shadow-cyan-500/10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-20 h-20 bg-black opacity-10 rounded-full blur-lg"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
            <Calculator size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
            <p className="text-cyan-100 text-sm font-medium opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* --- INPUTS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Custom Crop Select */}
          <div ref={dropdownRef} className="relative group">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
               <Sprout size={14} className="text-cyan-600"/> {t.crop_label}
            </label>
            
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full p-4 flex justify-between items-center border rounded-xl bg-slate-50 text-slate-700 font-semibold transition-all duration-200 outline-none
                ${isDropdownOpen ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-white' : 'border-slate-200 hover:border-cyan-400 hover:bg-white'}
              `}
            >
              <span className="truncate">{t.crops[crop]}</span>
              <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-600' : 'text-slate-400'}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-cyan-900/10 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-[fadeIn_0.2s_ease-out]">
                {cropList.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCrop(key);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-slate-50 last:border-0
                        ${crop === key ? 'bg-cyan-50 text-cyan-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                  >
                    {t.crops[key]}
                    {crop === key && <Check size={16} className="text-cyan-600"/>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Acre Input */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Beaker size={14} className="text-cyan-600"/> {t.area_label}
            </label>
            <div className="relative group">
                <input 
                  type="number" 
                  min="0.5" 
                  step="0.5" 
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-bold focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
                    ACRES
                </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
        >
          <Calculator size={20} /> {t.calc_btn}
        </button>

        {/* --- RESULT SECTION --- */}
        {result && (
          <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm font-semibold text-slate-400 uppercase tracking-widest">Analysis Report</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Urea Card */}
              <ResultCard title={t.urea} bags={result.urea.bags} kg={result.urea.kg} unit={t.bag} color="bg-blue-50 text-blue-700 border-blue-200" />
              {/* DAP Card */}
              <ResultCard title={t.dap} bags={result.dap.bags} kg={result.dap.kg} unit={t.bag} color="bg-amber-50 text-amber-700 border-amber-200" />
              {/* MOP Card */}
              <ResultCard title={t.mop} bags={result.mop.bags} kg={result.mop.kg} unit={t.bag} color="bg-red-50 text-red-700 border-red-200" />
            </div>

            {/* Total Cost Banner */}
            <div className="mt-6 bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
               
               <div className="flex items-center gap-3 relative z-10">
                  <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                    <Coins size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t.est_cost}</p>
                    <p className="text-[10px] text-slate-500">{t.note}</p>
                  </div>
               </div>
               
               <div className="text-3xl font-bold text-white relative z-10 font-mono tracking-tight">
                 ₹{result.totalCost.toLocaleString()}
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component for Result Cards
const ResultCard = ({ title, bags, kg, unit, color }) => (
    <div className={`p-4 rounded-2xl border ${color} flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1`}>
        <div className="flex items-center gap-2 mb-1 opacity-80">
            <Package size={14} />
            <span className="text-xs font-bold uppercase">{title}</span>
        </div>
        <div className="text-2xl font-extrabold">{bags} <span className="text-sm font-medium opacity-70">{unit}</span></div>
        <div className="text-[10px] font-semibold opacity-60 mt-1 bg-white/50 px-2 py-0.5 rounded-full">
            ({Math.round(kg)} kg)
        </div>
    </div>
);

export default FertilizerCalculator;