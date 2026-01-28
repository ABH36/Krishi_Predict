import React, { useState, useRef, useEffect } from 'react';
import { User, MapPin, Check, Sprout, Briefcase, ChevronDown, ArrowRight, Loader2 } from 'lucide-react'; 
import WheatIcon from '../assets/WheatIcon'; 
import axios from 'axios';

/* ✅ FIXED API BASE URL (DO NOT TOUCH ANYTHING ELSE) */
const API_BASE_URL = 'https://krishi-predict-exlq.onrender.com';

const RegisterScreen = ({ phone, onComplete, lang }) => {
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    crop: 'wheat'
  });
  
  const [role, setRole] = useState('farmer'); 
  const [loading, setLoading] = useState(false);

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
    welcome: "प्रोफाइल बनाएं",
    sub: "बेहतर अनुभव के लिए विवरण भरें",
    name: "पूरा नाम",
    dist: "जिला (District)",
    crop: "मुख्य फसल",
    btn: "प्रोफाइल सेव करें",
    role_farmer: "मैं किसान हूँ",
    role_trader: "मैं व्यापारी हूँ",
    crops: {
        wheat: "गेहूँ (Wheat)", rice: "धान (Rice)", garlic: "लहसुन (Garlic)",
        onion: "प्याज़ (Onion)", potato: "आलू (Potato)"
    }
  } : {
    welcome: "Setup Profile",
    sub: "Complete details for better experience",
    name: "Full Name",
    dist: "District",
    crop: "Main Crop",
    btn: "Save Profile",
    role_farmer: "I am a Farmer",
    role_trader: "I am a Trader",
    crops: {
        wheat: "Wheat", rice: "Rice", garlic: "Garlic",
        onion: "Onion", potato: "Potato"
    }
  };

  const cropOptions = ['wheat', 'rice', 'garlic', 'onion', 'potato'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/update`,
        {
          phone: phone,
          name: formData.name,
          district: formData.district,
          crop: role === 'farmer' ? formData.crop : [],
          language: lang,
          role: role
        }
      );

      localStorage.setItem('kisan_user', JSON.stringify(res.data.user));
      onComplete(res.data.user);

    } catch (err) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const themeColor = role === 'farmer' ? 'emerald' : 'indigo';
  const bgGradient = role === 'farmer' ? 'from-emerald-50 to-teal-100' : 'from-indigo-50 to-blue-100';
  const buttonGradient = role === 'farmer' ? 'from-emerald-600 to-green-600' : 'from-indigo-600 to-blue-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-6 transition-colors duration-500`}>
      
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-[slideUp_0.5s_ease-out]">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
           <div className={`p-4 rounded-2xl shadow-lg transform transition-all duration-300 ${role === 'farmer' ? 'bg-emerald-100 rotate-0' : 'bg-indigo-100 rotate-12'}`}>
             {role === 'farmer' ? (
                <WheatIcon className="w-10 h-10 text-emerald-600" />
             ) : (
                <Briefcase className="w-10 h-10 text-indigo-600" />
             )}
           </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2 tracking-tight">{t.welcome}</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">{t.sub}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ROLE TOGGLE (Cards) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                type="button" 
                onClick={() => setRole('farmer')} 
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${role === 'farmer' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200 hover:bg-white'}`}
            >
                <div className={`mb-2 p-2 rounded-full w-fit ${role === 'farmer' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Sprout size={20}/> 
                </div>
                <span className={`block font-bold text-sm ${role === 'farmer' ? 'text-emerald-800' : 'text-slate-500'}`}>{t.role_farmer}</span>
                {role === 'farmer' && <div className="absolute top-3 right-3 text-emerald-500"><Check size={16} /></div>}
            </button>

            <button 
                type="button" 
                onClick={() => setRole('trader')} 
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${role === 'trader' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-white'}`}
            >
                <div className={`mb-2 p-2 rounded-full w-fit ${role === 'trader' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Briefcase size={20}/> 
                </div>
                <span className={`block font-bold text-sm ${role === 'trader' ? 'text-indigo-800' : 'text-slate-500'}`}>{t.role_trader}</span>
                {role === 'trader' && <div className="absolute top-3 right-3 text-indigo-500"><Check size={16} /></div>}
            </button>
          </div>

          {/* Name Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t.name}</label>
            <div className={`relative flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:border-${themeColor}-500 focus-within:ring-4 focus-within:ring-${themeColor}-500/10 transition-all`}>
              <User size={20} className={`text-slate-400 group-focus-within:text-${themeColor}-500 transition-colors mr-3`} />
              <input 
                required 
                className="w-full bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-300" 
                placeholder="Ex: Rajesh Kumar" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>

          {/* District Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t.dist}</label>
            <div className={`relative flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:border-${themeColor}-500 focus-within:ring-4 focus-within:ring-${themeColor}-500/10 transition-all`}>
              <MapPin size={20} className={`text-slate-400 group-focus-within:text-${themeColor}-500 transition-colors mr-3`} />
              <input 
                required 
                className="w-full bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-300" 
                placeholder="Ex: Sehore" 
                value={formData.district} 
                onChange={(e) => setFormData({...formData, district: e.target.value})} 
              />
            </div>
          </div>

          {/* Custom Crop Select (Farmer Only) */}
          {role === 'farmer' && (
            <div className="space-y-2 group animate-[fadeIn_0.3s_ease-out]" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t.crop}</label>
                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full flex justify-between items-center border-2 rounded-xl px-4 py-3 bg-white text-slate-700 font-semibold transition-all ${isDropdownOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-300'}`}
                    >
                        <span className="flex items-center gap-3">
                            <Sprout size={20} className="text-emerald-500" />
                            {t.crops[formData.crop] || formData.crop}
                        </span>
                        <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-[fadeIn_0.2s_ease-out]">
                            {cropOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setFormData({...formData, crop: option});
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-emerald-50 transition-colors ${formData.crop === option ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600'}`}
                                >
                                    {t.crops[option]}
                                    {formData.crop === option && <Check size={18} className="text-emerald-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          )}

          <button 
            disabled={loading} 
            className={`w-full bg-gradient-to-r ${buttonGradient} hover:shadow-lg hover:shadow-${themeColor}-500/30 text-white font-bold py-4 rounded-xl mt-6 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>{t.btn} <ArrowRight size={20}/></>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;