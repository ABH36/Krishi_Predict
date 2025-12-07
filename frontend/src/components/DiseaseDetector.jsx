import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader2, X, ScanLine, Activity } from 'lucide-react';
import axios from 'axios';

const DiseaseDetector = ({ lang, district }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const t = lang === 'hi' ? {
    title: "फसल डॉक्टर (AI)",
    subtitle: "पत्ते की फोटो से बीमारी और इलाज जानें",
    desc: "AI द्वारा सटीक जांच के लिए साफ फोटो अपलोड करें",
    upload: "फोटो खींचें या अपलोड करें",
    analyzing: "AI स्कैन कर रहा है...",
    disease_detected: "बीमारी का पता चला",
    healthy: "फसल स्वस्थ है",
    cure_title: "सुझाव / उपचार",
    confidence: "सटीकता",
    reset: "नई स्कैनिंग करें"
  } : {
    title: "Crop Doctor (AI)",
    subtitle: "Instant disease detection & cure",
    desc: "Upload clear leaf photo for accurate diagnosis",
    upload: "Click or Upload Photo",
    analyzing: "AI Scanning...",
    disease_detected: "Issue Detected",
    healthy: "Healthy Crop",
    cure_title: "Recommended Cure",
    confidence: "Confidence",
    reset: "Scan Another"
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);

    try {
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;
        
        const response = await fetch(image);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result;
            
            // Backend call
            const res = await axios.post(`${API_URL}/api/disease/detect`, {
                image: base64data,
                district: district || "Sehore"
            });
            
            setResult(res.data);
            setLoading(false);
        };
        reader.readAsDataURL(blob);

    } catch (err) {
        alert("Scan failed. Check connection.");
        setLoading(false);
    }
  };

  // Color logic for results
  const getRiskStyles = (color) => {
      if (color === 'red') return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <AlertTriangle /> };
      if (color === 'orange') return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: <Activity /> };
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: <CheckCircle /> };
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-slate-100 max-w-3xl mx-auto transition-all hover:shadow-2xl">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <ScanLine size={100} />
         </div>
         <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner">
               <Camera size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
              <p className="text-violet-100 text-sm font-medium opacity-90">{t.subtitle}</p>
            </div>
         </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* State 1: Image Upload / Preview Area */}
        {!result ? (
          <div className="space-y-6">
             <p className="text-slate-500 text-center text-sm">{t.desc}</p>
             
             <div className="relative group">
                <div className={`
                    relative border-2 border-dashed rounded-2xl p-2 transition-all duration-300
                    ${image ? 'border-violet-400 bg-violet-50' : 'border-slate-300 hover:border-violet-400 hover:bg-slate-50 cursor-pointer'}
                    min-h-[250px] flex flex-col items-center justify-center overflow-hidden
                `}>
                    
                    {image ? (
                        <>
                            {/* Image Preview with Scanner Overlay */}
                            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm">
                                <img src={image} alt="Leaf Preview" className="w-full h-full object-cover" />
                                
                                {/* Loading Scanner Effect */}
                                {loading && (
                                    <div className="absolute inset-0 bg-black/30 z-10">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
                                            <Loader2 size={40} className="animate-spin text-green-400" />
                                            <span className="font-bold tracking-widest uppercase text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur">
                                                {t.analyzing}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Remove Button */}
                                {!loading && (
                                    <button 
                                        onClick={() => setImage(null)} 
                                        className="absolute top-3 right-3 bg-white/90 text-slate-600 hover:text-red-500 p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                                    >
                                        <X size={20}/>
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Upload Placeholder */
                        <label className="flex flex-col items-center cursor-pointer w-full h-full py-10">
                            <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <span className="text-lg font-bold text-slate-700">{t.upload}</span>
                            <span className="text-xs text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-full">Supports JPG, PNG</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>
             </div>

             {/* Action Button */}
             {image && !loading && (
                <button 
                    onClick={handleScan}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-violet-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <ScanLine size={24} /> Scan Now
                </button>
             )}
          </div>
        ) : (
          /* State 2: Result Display */
          <div className="animate-[fadeIn_0.5s_ease-out]">
             
             {/* Diagnosis Card */}
             <div className={`p-6 rounded-2xl border ${getRiskStyles(result.risk_color).bg} ${getRiskStyles(result.risk_color).border} mb-6`}>
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-xl bg-white shadow-sm h-fit ${getRiskStyles(result.risk_color).text}`}>
                            {getRiskStyles(result.risk_color).icon}
                        </div>
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${getRiskStyles(result.risk_color).text}`}>
                                {result.risk_color === 'green' ? t.healthy : t.disease_detected}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                                {result.disease_name}
                            </h3>
                        </div>
                    </div>
                    {/* Confidence Badge */}
                    <div className="text-center hidden sm:block">
                        <div className="text-2xl font-black text-slate-700">{(result.confidence).toFixed(0)}%</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.confidence}</div>
                    </div>
                </div>
             </div>

             {/* Solution Section (Only if disease detected) */}
             {result.risk_color !== 'green' && (
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                    <h4 className="flex items-center gap-2 text-violet-700 font-bold mb-3">
                        <CheckCircle size={18} /> {t.cure_title}
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                        {result.solution}
                    </p>
                 </div>
             )}

             {/* Reset Button */}
             <button 
                onClick={() => {setImage(null); setResult(null);}} 
                className="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-violet-600 font-bold transition-colors flex items-center justify-center gap-2"
             >
                <Camera size={18} /> {t.reset}
             </button>
          </div>
        )}
      </div>

      {/* Tailwind Animation Keyframes for Scanning (Needs config or style tag if not in global css) */}
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DiseaseDetector;