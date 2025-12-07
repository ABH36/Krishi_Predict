import React, { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress Bar Animation Logic
    const duration = 2500; // 2.5 seconds
    const intervalTime = 25; // Update every 25ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        onFinish();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950 flex flex-col items-center justify-center text-white z-50 overflow-hidden">
      
      {/* Background Ambient Glows (Decorations) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-yellow-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-10 animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Animated Logo Container */}
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl animate-[float_3s_ease-in-out_infinite]">
                <Sprout size={72} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
        </div>
        
        {/* Text Animation */}
        <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-200 drop-shadow-sm">
            Krishi<span className="text-yellow-400">Predict</span>
            </h1>
            <p className="text-emerald-200/80 text-sm font-medium tracking-[0.3em] uppercase animate-[fadeIn_1s_ease-out]">
            Kisan Ka Bharosa
            </p>
        </div>
      </div>
      
      {/* Smart Progress Bar */}
      <div className="absolute bottom-16 w-64">
        <div className="h-1.5 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="text-center text-[10px] text-emerald-500 mt-2 font-mono">
            Loading Resources... {Math.round(progress)}%
        </p>
      </div>

      {/* Custom Keyframes for Float Animation */}
      <style>{`
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;