import React, { useState, useEffect } from 'react';
import { Sprout, Menu, X, Globe, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import axios from 'axios';
import NotificationPanel from './NotificationPanel'; 

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://krishi-predict-exlq.onrender.com';


const Navbar = ({ user, onLogout, lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Notifications Logic (Same as before)
  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/notifications`);
            setNotifications(res.data);
            setUnreadCount(res.data.length); 
        } catch (e) { console.error("Notif Error", e); }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000); 
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  const t = lang === 'hi' ? {
    home: "होम",
    market: "मंडी भाव",
    weather: "मौसम",
    logout: "लॉग आउट",
    profile: "प्रोफाइल"
  } : {
    home: "Home",
    market: "Market Rates",
    weather: "Weather",
    logout: "Logout",
    profile: "Profile"
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out border-b
        ${isScrolled 
          ? 'bg-emerald-950/80 backdrop-blur-xl border-white/10 py-3 shadow-lg' 
          : 'bg-emerald-950 border-transparent py-5 shadow-none'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center text-white">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-400 to-green-600 p-2.5 rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                    <Sprout size={24} className="text-white" />
                </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">
                Krishi<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Predict</span>
              </h1>
              <p className="text-[10px] text-emerald-300 font-medium tracking-widest uppercase hidden md:block opacity-80">AI Farming Assistant</p>
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Notification Bell */}
            <button 
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors group"
            >
                <Bell size={22} className="text-emerald-100 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-900 animate-pulse"></span>
                )}
            </button>

            {/* Language Switcher */}
            <button 
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} 
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
            >
              <Globe size={14} className="text-yellow-400" /> 
              <span>{lang === 'en' ? 'Hindi' : 'English'}</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors cursor-default">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-emerald-950 font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-sm">
                  <p className="font-bold leading-none text-emerald-50">{user.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-emerald-400/80 font-medium">Farmer</p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
                onClick={onLogout} 
                className="bg-red-500/10 text-red-400 p-2.5 rounded-full hover:bg-red-500 hover:text-white border border-transparent hover:border-red-400/30 transition-all duration-300"
                title={t.logout}
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* MOBILE MENU BTN */}
          <div className="flex items-center gap-3 md:hidden">
             {/* Mobile Bell */}
             <button onClick={() => setIsNotifOpen(true)} className="relative p-2">
                <Bell size={24} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-emerald-950"></span>}
             </button>
             
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-white/10 rounded-lg active:scale-95 transition-transform"
             >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
             </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN (Glass Effect) */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-emerald-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 flex flex-col gap-4 text-white">
            
            {/* Mobile User Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
               <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-emerald-900 font-bold text-xl">
                  {user.name?.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-xs text-emerald-400">+91 {user.phone}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 active:scale-95 transition-all">
                   <Globe size={18} className="text-yellow-400"/> {lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
                </button>
            </div>

            <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/20 text-red-200 p-4 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20} /> {t.logout}
            </button>
          </div>
        </div>
      </nav>

      {/* NOTIFICATION PANEL (SLIDE OVER) */}
      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
      />
    </>
  );
};

export default Navbar;