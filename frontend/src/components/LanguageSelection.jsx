import React from 'react';
import { Sprout, ChevronRight, Languages } from 'lucide-react';

const LanguageSelection = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-500 to-teal-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor (Leaves/Circles) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400 opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 relative z-10 animate-[fadeIn_0.6s_ease-out]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-100 rounded-2xl mb-6 shadow-inner ring-4 ring-emerald-50">
            <Sprout size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">KrishiPredict</h2>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium bg-gray-100 py-1 px-3 rounded-full mx-auto w-fit">
            <Languages size={14} />
            <span>Select Language / भाषा चुनें</span>
          </div>
        </div>

        {/* Language Options */}
        <div className="space-y-4">
          
          {/* Hindi Option */}
          <button 
            onClick={() => onSelect('hi')}
            className="group w-full relative flex items-center p-4 bg-white border-2 border-gray-100 hover:border-emerald-500 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-3xl border border-orange-100 group-hover:scale-110 transition-transform">
              🇮🇳
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">हिंदी (Hindi)</h3>
              <p className="text-xs text-gray-500 font-medium">खेती की जानकारी हिंदी में</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </button>

          {/* English Option */}
          <button 
            onClick={() => onSelect('en')}
            className="group w-full relative flex items-center p-4 bg-white border-2 border-gray-100 hover:border-blue-500 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-3xl border border-blue-100 group-hover:scale-110 transition-transform">
              🇬🇧
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">English</h3>
              <p className="text-xs text-gray-500 font-medium">Crop info in English</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </button>

        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
          Trusted by 10,000+ Farmers • 100% Secure
        </p>
      </div>
    </div>
  );
};

export default LanguageSelection;