import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle, Loader2, Sprout, ChevronDown, Check, User, Phone, Globe, LogOut } from 'lucide-react';

// --- COMPONENTS IMPORT ---
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Navbar from './components/Navbar'; 
import PriceChart from './components/PriceChart';
import MandiComparison from './components/MandiComparison';
import WeatherCard from './components/WeatherCard';
import DiseaseDetector from './components/DiseaseDetector';
import FertilizerCalculator from './components/FertilizerCalculator';
import CropSuggestion from './components/CropSuggestion'; 
import ProfitSimulator from './components/ProfitSimulator'; 
import LiveReporter from './components/LiveReporter';
import KisanBazaar from './components/KisanBazaar';
import ChatBot from './components/ChatBot'; 
import VoiceAssistant from './components/VoiceAssistant';
import AdminPanel from './components/AdminPanel';
import TraderDashboard from './components/TraderDashboard';
import BottomNav from './components/BottomNav';
import { translations } from './translations';

/* ✅ ONLY REQUIRED FIX — DO NOT TOUCH ANYTHING ELSE */
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://krishi-predict-exlq.onrender.com';

function App() {
  const [screen, setScreen] = useState('splash');
  const [lang, setLang] = useState('hi'); 
  const [user, setUser] = useState(null);
  const [tempPhone, setTempPhone] = useState('');

  const [formData, setFormData] = useState({
    crop: 'garlic',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    area: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [activeTab, setActiveTab] = useState('home');
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = translations[lang];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCropDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('kisan_user');
    const savedLang = localStorage.getItem('kisan_lang');

    if (savedLang) setLang(savedLang);

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      if (userData.district) {
        setFormData(prev => ({ ...prev, district: userData.district }));
      }

      if (userData.preferred_crops?.length > 0) {
        setFormData(prev => ({ ...prev, crop: userData.preferred_crops[0] }));
      }
    }
  }, []);

  // Fetch alerts (FIXED HTTPS CALL)
  useEffect(() => {
    const currentDistrict = user?.district || formData.district;

    if (currentDistrict && screen === 'dashboard' && user?.role === 'farmer') {
      axios
        .get(`${API_BASE_URL}/api/alerts/${currentDistrict}`)
        .then(res => setAlerts(res.data))
        .catch(err => console.error("Alert Error", err));
    }
  }, [user, formData.district, screen]);

  const handleSplashFinish = () => {
    if (user) setScreen('dashboard');
    else setScreen('language');
  };

  const handleLanguageSelect = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('kisan_lang', selectedLang);
    setScreen('login');
  };

  const handleLoginSuccess = (userData, isNewUser) => {
    if (isNewUser) {
      setTempPhone(userData.phone);
      setScreen('register');
    } else {
      finishLogin(userData);
    }
  };

  const handleRegisterComplete = (userData) => {
    finishLogin(userData);
  };

  const finishLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('kisan_user', JSON.stringify(userData));
    if (userData.district) {
      setFormData(prev => ({ ...prev, district: userData.district }));
    }
    setScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('kisan_user');
    setUser(null);
    setScreen('login');
    setActiveTab('home');
  };

  // 🔥 PRICE PREDICTION (FIXED HTTPS CALL)
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, {
        crop: formData.crop,
        district: formData.district,
        state: formData.state,
        area_acres: formData.area
      });
      setResult(response.data);
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- CROPS LIST ---
  const cropOptions = [
    { value: 'wheat', label: t.crops.wheat },
    { value: 'rice', label: t.crops.rice },
    { value: 'garlic', label: t.crops.garlic },
    { value: 'onion', label: t.crops.onion },
    { value: 'potato', label: t.crops.potato },
    { value: 'tomato', label: t.crops.tomato }
  ];

  const getSelectedLabel = () => {
    const selected = cropOptions.find(c => c.value === formData.crop);
    return selected ? selected.label : t.crop_label;
  };

  // --- RENDER INPUT FORM (Reused) ---
  const renderInputForm = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-farm-green animate-fade-in">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-farm-dark">
            <MapPin size={20} /> {t.fill_info}
        </h2>
        <p className="text-sm text-gray-500 mb-4">नमस्ते, {user?.name || "Kisan Bhai"}</p>
        
        <form onSubmit={handlePredict} className="space-y-4">
            <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.crop_label}</label>
                <button 
                  type="button"
                  onClick={() => setIsCropDropdownOpen(!isCropDropdownOpen)}
                  className="w-full p-3 flex justify-between items-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green bg-farm-light text-gray-700 font-medium transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sprout size={18} className="text-farm-green"/> 
                    {getSelectedLabel()}
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isCropDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCropDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-fade-in-down">
                    {cropOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, crop: option.value });
                          setIsCropDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-green-50 transition-colors ${formData.crop === option.value ? 'bg-green-50 text-farm-green font-bold' : 'text-gray-700'}`}
                      >
                        {option.label}
                        {formData.crop === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.district_label}</label>
                <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green outline-none transition-all"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-400">
                        <MapPin size={18} />
                    </div>
                </div>
            </div>

            <button disabled={loading} className="w-full bg-farm-green hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
                {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} />}
                {loading ? t.btn_loading : t.btn_predict}
            </button>
        </form>
    </div>
  );

  // --- RESULTS HELPER ---
  const renderResults = () => {
    if (!result) return (
        <div className="flex flex-col items-center justify-center text-gray-400 p-10 border-2 border-dashed border-gray-200 rounded-xl mt-6">
           <Sprout size={48} className="mb-2 opacity-50" />
           <p>Select crop to start prediction</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">{t.current_price}</p>
              <p className="text-2xl font-bold text-gray-800">₹{result.current_price}/kg</p>
            </div>
            <div className={`p-4 rounded-xl shadow-md border-l-4 text-white ${result.trend === 'increasing' ? 'bg-green-600' : 'bg-orange-500'}`}>
              <p className="text-sm opacity-90">{t.advice_title}</p>
              <p className="text-lg font-bold">{result.advice}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-farm-gold">
              <p className="text-sm text-gray-500">{t.confidence}</p>
              <p className="text-2xl font-bold text-gray-800">{(result.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <PriceChart data={result.forecast} cropName={t.crops[formData.crop] || formData.crop} />
          </div>

          <ProfitSimulator lang={lang} predictedPrice={result.current_price} />

          {result.nearby_markets && (
             <MandiComparison markets={result.nearby_markets} labels={{
                title: t.mandi_title, col_mandi: t.col_mandi, col_dist: t.col_dist, col_price: t.col_price, col_status: t.col_status, best: t.status_best
            }} />
          )}
        </div>
    );
  };

  // --- RENDER SCREENS (Splash, Auth, Admin) ---
  if (screen === 'splash') return <SplashScreen onFinish={handleSplashFinish} />;
  if (screen === 'language') return <LanguageSelection onSelect={handleLanguageSelect} />;
  if (screen === 'login') return <LoginScreen onLoginSuccess={handleLoginSuccess} lang={lang} onAdminClick={() => setScreen('admin')} />;
  if (screen === 'register') return <RegisterScreen phone={tempPhone} onComplete={handleRegisterComplete} lang={lang} />;
  if (screen === 'admin') return <AdminPanel onLogout={() => setScreen('login')} />;

  // --- MAIN DASHBOARD (HANDLES BOTH FARMER & TRADER) ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans animate-fade-in pb-28 md:pb-10">
      
      {/* Global Navbar */}
      <Navbar user={user} onLogout={handleLogout} lang={lang} setLang={setLang} />

      {/* ALERTS (Only Farmer) */}
      <div className="pt-20">
        {user?.role === 'farmer' && alerts.length > 0 && (
          <div className="bg-red-600 text-white px-4 py-2 shadow-md relative overflow-hidden">
            <div className="container mx-auto flex items-center gap-3 animate-pulse">
              <AlertTriangle size={24} className="text-yellow-300 shrink-0" />
              <div className="text-sm md:text-base font-medium">
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-wider mr-2">Alert</span>
                आपके क्षेत्र <b>({formData.district})</b> में {alerts.map((a, i) => (<span key={i} className="mx-1 font-bold text-yellow-300 underline decoration-white">'{a.disease}' ({a.count})</span>))} देखे गए हैं।
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`container mx-auto p-4 md:p-8 ${alerts.length === 0 ? 'pt-4 md:pt-24' : ''}`}>
        
        {/* =======================
            TRADER LOGIC
           ======================= */}
        {user?.role === 'trader' && (
            <>
                {activeTab === 'home' && <TraderDashboard user={user} />}
                
                {activeTab === 'profile' && (
                    <div className="max-w-md mx-auto mt-10">
                        {/* Reused Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-indigo-900 h-24 relative">
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-900 border-4 border-white shadow-md">
                                        {user.name?.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500 font-medium">{user.phone}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                                        Trader
                                    </span>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                        <Globe size={18} className="text-gray-500"/> Change Language
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-bold">
                                        <LogOut size={18}/> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}

        {/* =======================
            FARMER LOGIC
           ======================= */}
        {user?.role === 'farmer' && (
            <>
                {/* TAB 1: HOME */}
                {activeTab === 'home' && (
                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-6">
                    <CropSuggestion lang={lang} district={formData.district} />
                    {renderInputForm()}
                    <DiseaseDetector lang={lang} district={formData.district} />
                    <FertilizerCalculator lang={lang} />
                    <KisanBazaar lang={lang} district={formData.district} user={user} />
                    <LiveReporter lang={lang} district={formData.district} user={user} />
                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2"><AlertTriangle size={20}/>{error}</div>}
                    </div>
                    <div className="md:col-span-8">
                    <WeatherCard district={formData.district} />
                    {renderResults()}
                    </div>
                </div>
                )}

                {/* TAB 2: PREDICT */}
                {activeTab === 'predict' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <CropSuggestion lang={lang} district={formData.district} />
                        {renderInputForm()}
                        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2"><AlertTriangle size={20}/>{error}</div>}
                        {renderResults()}
                    </div>
                )}

                {/* TAB 3: MANDI */}
                {activeTab === 'mandi' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <KisanBazaar lang={lang} district={formData.district} user={user} />
                        <LiveReporter lang={lang} district={formData.district} user={user} />
                    </div>
                )}

                {/* TAB 4: WEATHER */}
                {activeTab === 'weather' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <WeatherCard district={formData.district} />
                        <DiseaseDetector lang={lang} district={formData.district} />
                    </div>
                )}

                {/* TAB 5: PROFILE */}
                {activeTab === 'profile' && (
                    <div className="max-w-md mx-auto mt-10">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-green-600 h-24 relative">
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-900 border-4 border-white shadow-md">
                                        {user.name?.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500 font-medium">{user.phone}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                                        {user.role}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        {user.district}
                                    </span>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                        <Globe size={18} className="text-gray-500"/> Change Language ({lang === 'en' ? 'Hindi' : 'English'})
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-bold">
                                        <LogOut size={18}/> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}

      </div>

      <VoiceAssistant />
      <ChatBot lang={lang} district={formData.district} />
      
      {/* BOTTOM NAVIGATION (Pass Role) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} role={user?.role} />
      
    </div>
  );
}

export default App;