import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Phone, Plus, Tag, Scale, User, X, Loader2, CheckCircle, ChevronDown, Check, Store, Calendar, Sprout } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://krishi-predict-exlq.onrender.com';

const KisanBazaar = ({ lang, district, user }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newItem, setNewItem] = useState({ crop: 'Wheat', variety: '', quantity: '', expectedPrice: '' });

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    title: "किसान बाज़ार",
    subtitle: "सीधे खरीदार से जुड़ें और फसल बेचें",
    sell_btn: "फसल बेचें",
    cancel: "रद्द करें",
    list_title: `(${district}) में उपलब्ध फसलें`,
    form_title: "नयी बिक्री लिस्टिंग बनाएं",
    crop: "फसल चुनें",
    variety: "किस्म (जैसे: शरबती)",
    qty: "मात्रा (क्विंटल)",
    price: "भाव (₹/क्विंटल)",
    submit: "मार्केट में लिस्ट करें",
    processing: "लिस्ट हो रहा है...",
    no_data: "अभी कोई फसल बिक्री के लिए उपलब्ध नहीं है।",
    my_post: "मेरी पोस्ट",
    contact: "संपर्क करें",
    sold_by: "विक्रेता:",
    crops: {
        Wheat: "गेहूँ (Wheat)", Rice: "धान (Rice)", Garlic: "लहसुन (Garlic)",
        Onion: "प्याज़ (Onion)", Soybean: "सोयाबीन (Soybean)", Potato: "आलू (Potato)", Tomato: "टमाटर (Tomato)"
    }
  } : {
    title: "Kisan Bazaar",
    subtitle: "Connect directly with buyers",
    sell_btn: "Sell Crop",
    cancel: "Cancel",
    list_title: `Crops available in ${district}`,
    form_title: "Create New Listing",
    crop: "Select Crop",
    variety: "Variety (e.g. Organic)",
    qty: "Quantity (Quintal)",
    price: "Price (₹/Quintal)",
    submit: "List on Market",
    processing: "Listing...",
    no_data: "No crops listed in this market yet.",
    my_post: "My Post",
    contact: "Contact",
    sold_by: "Sold by:",
    crops: {
        Wheat: "Wheat", Rice: "Rice", Garlic: "Garlic",
        Onion: "Onion", Soybean: "Soybean", Potato: "Potato", Tomato: "Tomato"
    }
  };

  const cropList = ['Wheat', 'Rice', 'Garlic', 'Onion', 'Soybean', 'Potato', 'Tomato'];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/market/list/${district}`);
      setItems(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (district) fetchItems(); }, [district]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.quantity || !newItem.expectedPrice) return alert("Please fill all fields");
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/market/sell`, {
        ...newItem,
        sellerName: user?.name || "Kisan Bhai",
        sellerPhone: user?.phone,
        district: district,
        status: 'active'
      });
      setShowForm(false);
      setNewItem({ crop: 'Wheat', variety: '', quantity: '', expectedPrice: '' }); 
      fetchItems();
      alert("✅ Successfully Listed!");
    } catch (err) { alert("Error listing crop."); } 
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-slate-100 max-w-4xl mx-auto transition-all hover:shadow-2xl hover:shadow-emerald-500/10 relative">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-emerald-500 opacity-20 transform rotate-12">
           <ShoppingCart size={150} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                    <Store size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
                    <p className="text-emerald-100 text-sm font-medium opacity-90 flex items-center gap-1">
                       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> {t.subtitle}
                    </p>
                </div>
            </div>

            <button 
                onClick={() => setShowForm(!showForm)} 
                className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 border
                    ${showForm 
                        ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
                        : 'bg-white text-emerald-700 border-white hover:bg-emerald-50'
                    }`}
            >
                {showForm ? <X size={18}/> : <Plus size={18} />} {showForm ? t.cancel : t.sell_btn}
            </button>
        </div>
      </div>

      {/* Selling Form (Collapsible) */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50">
             <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-emerald-100 rounded text-emerald-600"><Plus size={16} /></div> 
                {t.form_title}
             </h3>
             
             <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* Custom Crop Dropdown */}
                  <div ref={dropdownRef} className="relative group">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Sprout size={14} className="text-emerald-600"/> {t.crop}
                    </label>
                    <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full p-3.5 flex justify-between items-center border rounded-xl bg-slate-50 text-slate-700 font-semibold transition-all duration-200 outline-none
                            ${isDropdownOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200 hover:border-emerald-400 hover:bg-white'}
                        `}
                    >
                        <span>{t.crops[newItem.crop] || newItem.crop}</span>
                        <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar animate-[fadeIn_0.2s_ease-out]">
                            {cropList.map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setNewItem({...newItem, crop: key});
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-slate-50 last:border-0
                                        ${newItem.crop === key ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    {t.crops[key]}
                                    {newItem.crop === key && <Check size={16} className="text-emerald-600"/>}
                                </button>
                            ))}
                        </div>
                    )}
                  </div>

                  {/* Variety Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.variety}</label>
                    <input 
                        placeholder="Ex: Sharbati, Desi" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium" 
                        value={newItem.variety} 
                        onChange={e => setNewItem({...newItem, variety: e.target.value})} 
                    />
                  </div>
                  
                  {/* Quantity Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Scale size={14} className="text-emerald-600"/> {t.qty}
                    </label>
                    <input 
                        type="number" 
                        placeholder="100" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium" 
                        value={newItem.quantity} 
                        onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
                        required
                    />
                  </div>

                  {/* Price Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Tag size={14} className="text-emerald-600"/> {t.price}
                    </label>
                    <input 
                        type="number" 
                        placeholder="2500" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold text-emerald-700" 
                        value={newItem.expectedPrice} 
                        onChange={e => setNewItem({...newItem, expectedPrice: e.target.value})} 
                        required
                    />
                  </div>
                </div>

                <button 
                    disabled={submitting} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20}/>} {submitting ? t.processing : t.submit}
                </button>
             </form>
          </div>
        </div>
      </div>
      
      {/* Listing Feed */}
      <div className="p-6 bg-slate-50 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                {t.list_title}
            </h3>
            <button onClick={fetchItems} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors border border-emerald-100">
                Refresh List
            </button>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="animate-spin mb-2 text-emerald-500" size={40} />
                <p className="text-sm">Fetching live rates...</p>
            </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <Store size={32} className="text-slate-300"/>
                    </div>
                    <p className="text-slate-500 font-medium">{t.no_data}</p>
                </div>
            ) : (
              items.map((item, i) => (
                <div key={i} className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all duration-300">
                  
                  {/* "My Post" Badge */}
                  {user?.phone === item.sellerPhone && (
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-xl shadow-sm z-10">
                        {t.my_post}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Crop Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                    {item.crop}
                                </h4>
                                {item.variety && (
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                        {item.variety}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600 pl-1">
                             <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                <Scale size={14} className="text-slate-400"/> 
                                <span className="font-semibold">{item.quantity} Qtl</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400"/> 
                                <span className="text-xs">{new Date(item.date).toLocaleDateString()}</span>
                             </div>
                        </div>
                    </div>

                    {/* Right: Price & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 pl-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asking Price</p>
                            <p className="text-2xl font-extrabold text-emerald-700">₹{item.expectedPrice}<span className="text-sm font-medium text-slate-400">/Q</span></p>
                        </div>
                        
                        {user?.phone !== item.sellerPhone && (
                            <a href={`tel:${item.sellerPhone}`} className="mt-2 flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95">
                                <Phone size={16} /> {t.contact}
                            </a>
                        )}
                        
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 sm:mt-0">
                           <User size={10} /> {item.sellerName}
                        </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KisanBazaar;