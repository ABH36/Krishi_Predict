import React, { useState } from 'react';
import { Lightbulb, TrendingUp, ArrowRight, Loader2, Award, ShieldCheck, Sprout } from 'lucide-react';
import axios from 'axios';

const CropSuggestion = ({ lang, district }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const t = lang === 'hi' ? {
    title: "AI फसल सलाहकार",
    subtitle: "अगले सीजन के लिए सबसे मुनाफे वाली फसल जानें",
    btn: "विश्लेषण शुरू करें",
    analyzing: "बाजार और मिट्टी का विश्लेषण चल रहा है...",
    best_choice: "सबसे ज्यादा मुनाफा",
    safe_bet: "सुरक्षित विकल्प",
    expected_profit: "अनुमानित आय (प्रति एकड़)",
    why: "AI का सुझाव:",
    reason_demand: "बाजार में भारी मांग की उम्मीद",
    safe_desc: "जोखिम कम है, भाव स्थिर रहने की उम्मीद है।"
  } : {
    title: "AI Crop Advisor",
    subtitle: "Discover the most profitable crop for next season",
    btn: "Start Analysis",
    analyzing: "Analyzing market & soil data...",
    best_choice: "Highest Return",
    safe_bet: "Low Risk Option",
    expected_profit: "Est. Income (1 Acre)",
    why: "AI Insight:",
    reason_demand: "High market demand expected",
    safe_desc: "Lower risk with stable price predictions."
  };

  // --- LOGIC SAME AS BEFORE ---
  const seasonalCrops = ['wheat', 'garlic', 'onion', 'potato', 'rice'];

  const calculateProfit = (crop, price) => {
    const standards = {
      wheat: { yield: 20, cost: 12000 },
      rice: { yield: 25, cost: 15000 },
      garlic: { yield: 40, cost: 40000 },
      onion: { yield: 100, cost: 25000 },
      potato: { yield: 120, cost: 30000 }
    };
    const std = standards[crop] || { yield: 20, cost: 15000 };
    return (std.yield * price) - std.cost;
  };

  const handleAnalysis = async () => {
    setLoading(true);
    setRecommendations(null);
    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

    try {
      const promises = seasonalCrops.map(crop => 
        axios.post(`${API_URL}/api/predict`, {
          crop: crop,
          district: district || "Sehore",
          state: "Madhya Pradesh",
          area_acres: 1
        }).then(res => ({ crop, price: res.data.current_price, trend: res.data.trend }))
      );

      const results = await Promise.all(promises);

      const rankedCrops = results.map(item => ({
        ...item,
        profit: calculateProfit(item.crop, item.price)
      })).sort((a, b) => b.profit - a.profit);

      const topPick = rankedCrops[0];
      const safePick = rankedCrops.find(c => c.crop === 'wheat' || c.crop === 'rice') || rankedCrops[1];

      setRecommendations({ top: topPick, safe: safePick });

    } catch (err) {
      console.error(err);
      alert("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- PREMIUM UI RENDER ---
  return (
    <div className="relative overflow-hidden rounded-3xl mt-8 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20">
      
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>

      <div className="relative z-10 p-6 md:p-8 text-white">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Lightbulb className="text-yellow-300 fill-yellow-300" size={24} /> 
              </div>
              {t.title}
            </h2>
            <p className="text-indigo-100 text-sm md:text-base mt-2 opacity-90">{t.subtitle}</p>
          </div>

          {!recommendations && !loading && (
            <button 
              onClick={handleAnalysis}
              className="group bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-400 hover:text-indigo-900 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              {t.btn} 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <Loader2 className="animate-spin text-yellow-300 w-12 h-12 mb-4" /> 
            <p className="text-lg font-medium text-indigo-100">{t.analyzing}</p>
          </div>
        )}

        {/* Results Grid */}
        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-out]">
            
            {/* 1. TOP CHOICE CARD (Premium White) */}
            <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-colors group-hover:bg-green-100"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Award size={12} /> {t.best_choice}
                  </span>
                  <TrendingUp className="text-green-600" size={28} />
                </div>

                <h3 className="text-3xl font-bold capitalize mb-1 text-slate-800">{recommendations.top.crop}</h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                   <Sprout size={14}/> {district || "Sehore"} Region
                </p>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                  <p className="text-xs text-green-700 font-semibold uppercase mb-1">{t.expected_profit}</p>
                  <p className="text-3xl font-extrabold text-green-700">₹{recommendations.top.profit.toLocaleString()}</p>
                </div>

                <div className="text-sm text-gray-600 border-t border-gray-100 pt-3">
                  <strong className="text-indigo-600">{t.why}</strong> {t.reason_demand}
                </div>
              </div>
            </div>

            {/* 2. SAFE BET CARD (Glassmorphism) */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl relative overflow-hidden group hover:bg-white/15 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-500/20 text-blue-100 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} /> {t.safe_bet}
                </span>
              </div>

              <h3 className="text-2xl font-bold capitalize mb-2 text-white">{recommendations.safe.crop}</h3>
              
              <div className="my-4">
                <p className="text-xs text-indigo-200 uppercase mb-1">{t.expected_profit}</p>
                <p className="text-2xl font-bold text-white">₹{recommendations.safe.profit.toLocaleString()}</p>
              </div>

              <p className="text-sm text-indigo-100 opacity-90 leading-relaxed border-t border-white/10 pt-3 mt-4">
                {t.safe_desc}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CropSuggestion;