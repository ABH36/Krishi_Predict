import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, User, MapPin, Filter, Calendar, Tag, Scale, Loader2, TrendingUp, Search } from 'lucide-react';
import axios from 'axios';

const TraderDashboard = ({ user }) => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

 const API_BASE_URL =
   window.location.hostname === 'localhost'
     ? 'http://localhost:5000'
     : 'https://krishi-predict-exlq.onrender.com';
 

  // Fetch Logic
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/market/list/${user.district || 'Sehore'}`);
        setListings(res.data);
      } catch (e) { 
        console.error(e); 
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  // Filtering Logic
  const filtered = filter === 'All' ? listings : listings.filter(i => i.crop === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 pt-20"> {/* Padding Adjust ki hai */}
      
      {/* 2. FILTER BAR (Sticky) */}
      <div className="sticky top-[80px] z-30 py-4 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 mb-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter Crops</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {['All', 'Wheat', 'Rice', 'Garlic', 'Onion', 'Soybean', 'Potato', 'Tomato'].map(c => (
                <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm border
                ${filter === c 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/30 scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
                >
                {c}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* 3. LISTINGS GRID */}
      <div className="container mx-auto px-4 py-6 min-h-[500px]">
        
        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-indigo-600 mb-4"/>
                <p className="text-sm font-bold text-slate-500 animate-pulse">Loading Market Data...</p>
            </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-slate-100 p-8 rounded-full mb-6 border-4 border-white shadow-lg">
                    <Search size={48} className="text-slate-300"/>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Listings Found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">There are currently no crops listed under this category in {user.district}.</p>
                <button onClick={() => setFilter('All')} className="mt-6 text-indigo-600 font-bold hover:underline">View All Crops</button>
            </div>
        )}

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {!loading && filtered.map((item, index) => (
            <div 
                key={item._id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                {/* Card Content (Same as before) */}
                <div className="p-5 flex justify-between items-start border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-slate-800">{item.crop}</h3>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase tracking-wide">Fresh</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Tag size={12}/> {item.variety || 'Standard Variety'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-indigo-700 tracking-tight">₹{item.expectedPrice}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">per Quintal</p>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors">
                            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                                <Scale size={12} className="text-indigo-400"/> Quantity
                            </p>
                            <p className="font-bold text-slate-700 text-lg">{item.quantity} Qtl</p>
                        </div>
                        <div className="flex-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors">
                            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mb-1">
                                <TrendingUp size={12} className="text-emerald-500"/> Total Value
                            </p>
                            <p className="font-bold text-emerald-700 text-lg">₹{(item.quantity * item.expectedPrice).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                            <User size={18}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">{item.sellerName}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Calendar size={10}/> {new Date(item.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    
                    <a 
                        href={`tel:${item.sellerPhone}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 text-sm font-bold transition-transform active:scale-95"
                    >
                        <Phone size={16} /> Contact
                    </a>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TraderDashboard;