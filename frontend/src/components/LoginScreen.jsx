import React, { useState } from 'react';
import { ArrowRight, Loader2, Phone, ShieldCheck, Lock, ChevronLeft } from 'lucide-react';
import WheatIcon from '../assets/WheatIcon';
import axios from 'axios';

/* ✅ FIXED API BASE URL (DO NOT CHANGE ANYTHING ELSE) */
const API_BASE_URL = 'https://krishi-predict-exlq.onrender.com';

const LoginScreen = ({ onLoginSuccess, lang, onAdminClick }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = lang === 'hi' ? {
    title: "कृषि-अनुमान",
    subtitle: "किसान का भरोसेमंद साथी",
    phone_label: "मोबाइल नंबर",
    otp_btn: "OTP प्राप्त करें",
    otp_label: "OTP दर्ज करें",
    otp_sub: "हमने आपके नंबर पर कोड भेजा है",
    verify_btn: "लॉगिन करें",
    resend: "नंबर बदलें",
    error_len: "कृपया सही नंबर डालें (10 अंक)",
    error_otp: "गलत OTP. दोबारा कोशिश करें.",
    welcome: "स्वागत है"
  } : {
    title: "KrishiPredict",
    subtitle: "Farmer's Trusted Partner",
    phone_label: "Mobile Number",
    otp_btn: "Get OTP",
    otp_label: "Enter OTP",
    otp_sub: "We sent a code to your number",
    verify_btn: "Verify & Login",
    resend: "Change Number",
    error_len: "Please enter valid 10-digit number",
    error_otp: "Invalid OTP. Try again.",
    welcome: "Welcome Back"
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError(t.error_len);
      return;
    }
    setError('');
    setLoading(true);

    // Fake OTP for Demo
    setTimeout(() => {
      setStep(2);
      setLoading(false);
      alert(`Test OTP: 1234`);
    }, 1000);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp !== '1234') {
      setError(t.error_otp);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { phone }
      );

      onLoginSuccess(res.data.user, res.data.isNewUser);

    } catch (err) {
      console.error(err);
      setError("Login failed. Try after sometime.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
    setOtp('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-yellow-400/10 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10 animate-[fadeIn_0.6s_ease-out]">
        
        {/* Brand Logo Area */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform duration-300">
            <WheatIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">{t.title}</h1>
        <p className="text-emerald-600 font-medium text-sm mb-8 bg-emerald-50 inline-block px-3 py-1 rounded-full">{t.subtitle}</p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-[slideUp_0.4s_ease-out]">
            <div className="text-left">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">{t.phone_label}</label>
              <div className="group flex items-center border-2 border-gray-100 rounded-xl px-3 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all bg-gray-50 focus-within:bg-white">
                <div className="pr-3 border-r border-gray-300 mr-3 flex items-center gap-1 text-gray-600 font-bold">
                    <span>🇮🇳</span> +91
                </div>
                <input 
                  type="number" 
                  className="w-full bg-transparent outline-none text-lg font-bold text-gray-800 placeholder-gray-300 tracking-wider"
                  placeholder="98765-43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                />
                <Phone size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
            
            <button 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>{t.otp_btn} <ArrowRight size={20} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 animate-[slideUp_0.4s_ease-out]">
            <div className="text-left">
              <div className="flex items-center justify-between mb-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1 block">{t.otp_label}</label>
                 <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">+91 {phone}</span>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-emerald-500" />
                </div>
                <input 
                  type="number" 
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 pl-10 mt-1 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-center text-3xl font-bold tracking-[0.5em] text-gray-800 transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>
              <p className="text-xs text-center text-gray-400 mt-3 font-medium">Demo OTP: <span className="text-gray-600 font-bold">1234</span></p>
            </div>
            
            <button 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>{t.verify_btn} <ShieldCheck size={20} /></>}
            </button>
            
            <button type="button" onClick={handleBack} className="w-full text-sm text-gray-500 hover:text-emerald-600 font-medium flex items-center justify-center gap-1 transition-colors py-2">
              <ChevronLeft size={16} /> {t.resend}
            </button>
          </form>
        )}

        {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> {error}
            </div>
        )}
        
        {/* --- ADMIN LOGIN LINK (Hidden/Subtle) --- */}
        <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
                onClick={onAdminClick} 
                className="text-[10px] text-gray-300 hover:text-emerald-600 transition-colors font-medium tracking-widest uppercase"
            >
                Authorized Personnel Only
            </button>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;