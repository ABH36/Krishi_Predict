import React from 'react';
import { MapPin, TrendingUp, Navigation, IndianRupee, Award } from 'lucide-react';

const MandiComparison = ({ markets, labels }) => {
  // Default fallback
  const t = labels || {
     title: "Mandi Comparison",
     col_mandi: "Mandi Name",
     col_dist: "Distance",
     col_price: "Price",
     col_status: "Status",
     best: "Best Price"
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
      
      {/* Header */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
             <MapPin size={20} />
          </div>
          {t.title}
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
           {markets.length} Markets Found
        </span>
      </div>
      
      <div className="p-4 md:p-0">
        
        {/* --- MOBILE VIEW (CARDS) --- */}
        <div className="md:hidden space-y-4">
          {markets.map((m, index) => (
            <div 
              key={index} 
              className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                m.is_best 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md shadow-green-100' 
                  : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
              }`}
            >
              {m.is_best && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm flex items-center gap-1">
                  <Award size={12} /> {t.best}
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{m.mandi}</h4>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 font-medium">
                    <Navigation size={12} className="text-blue-500" /> {m.distance}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-slate-200/60 pt-3 mt-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Rate</span>
                <div className={`text-xl font-black flex items-center ${m.is_best ? 'text-green-700' : 'text-slate-800'}`}>
                   <IndianRupee size={18} strokeWidth={3} /> {m.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW (TABLE) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-5 pl-8">{t.col_mandi}</th>
                <th className="p-5">{t.col_dist}</th>
                <th className="p-5">{t.col_price}</th>
                <th className="p-5 pr-8 text-right">{t.col_status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {markets.map((m, index) => (
                <tr 
                  key={index} 
                  className={`transition-colors hover:bg-slate-50/80 group ${m.is_best ? 'bg-green-50/30' : ''}`}
                >
                  <td className="p-5 pl-8 font-bold text-slate-700">
                    {m.mandi}
                    {m.is_best && <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                  </td>
                  <td className="p-5 text-slate-500 font-medium">
                    <div className="flex items-center gap-2 bg-slate-100 w-max px-3 py-1 rounded-full text-xs">
                       <Navigation size={12} className="text-blue-500" /> {m.distance}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`font-bold text-lg ${m.is_best ? 'text-green-700' : 'text-slate-800'}`}>
                      ₹{m.price}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    {m.is_best ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-green-200">
                        <TrendingUp size={14} /> {t.best}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-sm font-medium">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MandiComparison;