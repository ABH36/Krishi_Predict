import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Clock, User, Radio, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://krishi-predict-exlq.onrender.com';


const LiveReporter = ({ lang, district, user }) => {
  const [reports, setReports] = useState([]);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const t = lang === 'hi' ? {
    title: "मंडी लाइव हलचल",
    subtitle: "किसानों द्वारा रिपोर्ट की गई ताज़ा कीमतें",
    label: "आज का भाव क्या है?",
    placeholder: "0000",
    btn: "भाव भेजें",
    recent: "ताज़ा अपडेट्स (Live Feed)",
    no_data: "अभी कोई रिपोर्ट नहीं है। सबसे पहले आप बताएं!",
    thanks: "धन्यवाद! आपकी रिपोर्ट दर्ज हो गई।",
    just_now: "अभी",
    reporter: "रिपोर्टर"
  } : {
    title: "Mandi Live Buzz",
    subtitle: "Real-time prices reported by farmers",
    label: "What's the price today?",
    placeholder: "0000",
    btn: "Post Price",
    recent: "Live Feed",
    no_data: "No reports yet. Be the first to report!",
    thanks: "Thanks! Report submitted.",
    just_now: "Just Now",
    reporter: "Reporter"
  };


  // Fetch Reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/report/recent/${district}`);
      setReports(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchReports();
    // Refresh every 30s for live feel
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [district]);

  // Submit Report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price) return;
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/report/add`, {
        district: district,
        mandi: district, 
        crop: "Garlic", // Can be dynamic
        price: Number(price),
        reporterName: user?.name || "Kisan Bhai"
      });
      setPrice('');
      fetchReports(); 
      alert(t.thanks);
    } catch (err) {
      alert("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  // Time formatter
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-rose-100 max-w-3xl mx-auto transition-all hover:shadow-2xl hover:shadow-rose-500/10">
      
      {/* Header - Broadcasting Style */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white relative overflow-hidden">
        {/* Animated Pulse Circle */}
        <div className="absolute top-4 right-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                <Radio size={24} className="text-white animate-pulse" />
            </div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    {t.title} <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-400">Live</span>
                </h2>
                <p className="text-rose-100 text-sm font-medium opacity-90">{t.subtitle}</p>
            </div>
        </div>
      </div>

      <div className="p-0">
        
        {/* Input Section - Sticky Top */}
        <div className="bg-rose-50/50 p-6 border-b border-rose-100">
           <label className="text-xs font-bold text-rose-800 uppercase mb-2 block tracking-wide">{t.label}</label>
           
           <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1 group">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 font-bold text-lg">₹</span>
                 <input 
                    type="number" 
                    placeholder={t.placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose-200 bg-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all font-bold text-lg text-gray-800 placeholder-rose-200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                 />
              </div>
              <button 
                disabled={loading} 
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-6 rounded-xl font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} className="-ml-1" />} 
                <span className="hidden sm:inline">{t.btn}</span>
              </button>
           </form>
        </div>

        {/* Live Feed */}
        <div className="bg-white">
           <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                   <TrendingUp size={14} /> {t.recent}
               </h3>
               <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                   <MapPin size={10}/> {district || "Select District"}
               </span>
           </div>

           <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-2">
              {reports.length === 0 ? (
                 <div className="text-center py-12 px-6">
                    <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Megaphone size={30} className="text-rose-300" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm">{t.no_data}</p>
                 </div>
              ) : (
                 reports.map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-rose-50/50 border border-transparent hover:border-rose-100 transition-all group animate-[fadeIn_0.5s_ease-out]">
                       <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold shadow-sm">
                             <User size={18} />
                          </div>
                          
                          <div>
                             <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-gray-800">{report.reporterName}</p>
                                {i === 0 && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-bold">{t.just_now}</span>}
                             </div>
                             <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={10} /> {formatTime(report.time)} • {report.mandi}
                             </p>
                          </div>
                       </div>

                       <div className="text-right">
                          <p className="text-xl font-black text-gray-800 tracking-tight group-hover:text-rose-600 transition-colors">
                            ₹{report.price}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase">/ quintal</p>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default LiveReporter;