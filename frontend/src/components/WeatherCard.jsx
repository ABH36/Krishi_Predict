import React, { useEffect, useState } from 'react';
import { CloudRain, Sun, Wind, Cloud, Droplets, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// MP Major Districts Mapping
const DISTRICT_COORDS = {
  "sehore": { lat: 23.20, lon: 77.08 },
  "bhopal": { lat: 23.25, lon: 77.41 },
  "dewas": { lat: 22.96, lon: 76.05 },
  "indore": { lat: 22.71, lon: 75.85 },
  "ujjain": { lat: 23.17, lon: 75.78 },
  "vidisha": { lat: 23.52, lon: 77.81 },
  "raisen": { lat: 23.33, lon: 77.79 },
  "hoshangabad": { lat: 22.75, lon: 77.72 },
  "harda": { lat: 22.33, lon: 76.99 },
  "betul": { lat: 21.90, lon: 77.90 },
};

const WeatherCard = ({ district }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const distKey = district?.toLowerCase() || "sehore";
        const coords = DISTRICT_COORDS[distKey] || DISTRICT_COORDS["sehore"];

        // Open-Meteo API Call
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_sum&timezone=auto`;
        
        const res = await axios.get(url);
        
        setWeather(res.data.current);
        setForecast(res.data.daily); 
        setLoading(false);

      } catch (e) {
        console.error("Weather error", e);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [district]);

  if (loading) return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-200 h-64 animate-pulse shadow-lg mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        <div className="absolute bottom-4 left-6 h-4 w-24 bg-slate-300 rounded"></div>
        <div className="absolute top-6 left-6 h-8 w-32 bg-slate-300 rounded"></div>
    </div>
  );

  if (!weather) return null;

  // Helper: Weather Logic
  const getWeatherInfo = (code) => {
    if (code <= 3) return { 
        icon: <Sun size={64} className="text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)] animate-[pulse_4s_infinite]" />, 
        smallIcon: <Sun size={20} className="text-yellow-300"/>,
        label: "Clear Sky", 
        gradient: "from-sky-400 via-blue-500 to-indigo-600",
        advice: "Weather is clear. Good for spraying."
    };
    if (code <= 48) return { 
        icon: <Cloud size={64} className="text-slate-200 drop-shadow-md animate-[float_4s_ease-in-out_infinite]" />, 
        smallIcon: <Cloud size={20} className="text-slate-300"/>,
        label: "Cloudy", 
        gradient: "from-slate-400 to-slate-600",
        advice: "Cloudy weather expected."
    };
    if (code <= 67) return { 
        icon: <CloudRain size={64} className="text-blue-200 drop-shadow-md" />, 
        smallIcon: <CloudRain size={20} className="text-blue-300"/>,
        label: "Rainy", 
        gradient: "from-blue-700 to-slate-800",
        advice: "Avoid irrigation/spraying today."
    };
    return { 
        icon: <CloudRain size={64} className="text-purple-300 drop-shadow-md" />, 
        smallIcon: <CloudRain size={20} className="text-purple-300"/>,
        label: "Stormy", 
        gradient: "from-indigo-800 to-purple-900",
        advice: "Stay safe. Heavy rain alert."
    };
  };

  const info = getWeatherInfo(weather.weather_code);
  const isRainingSoon = forecast.precipitation_sum[0] > 2 || forecast.precipitation_sum[1] > 2;

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl text-white mb-8 transition-all hover:scale-[1.01] animate-[fadeIn_0.5s_ease-out]`}>
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient}`}></div>
      
      {/* Dynamic Overlay Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>

      <div className="relative z-10 p-6 md:p-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md w-max px-3 py-1 rounded-full border border-white/10 mb-2">
                    <MapPin size={12} className="text-white"/>
                    <span className="text-xs font-bold uppercase tracking-wider">{district || "Sehore"}</span>
                </div>
                <div className="flex items-end gap-2">
                    <h2 className="text-6xl font-bold tracking-tighter drop-shadow-sm">
                        {Math.round(weather.temperature_2m)}°
                    </h2>
                    <p className="text-lg font-medium mb-1 opacity-90">{info.label}</p>
                </div>
            </div>
            
            {/* Weather Icon */}
            <div className="mt-2">
                {info.icon}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="flex gap-4 mt-6">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full"><Wind size={16}/></div>
                <div>
                    <p className="text-[10px] text-white/70 uppercase font-bold">Wind</p>
                    <p className="text-sm font-bold">{weather.wind_speed_10m} km/h</p>
                </div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full"><Droplets size={16}/></div>
                <div>
                    <p className="text-[10px] text-white/70 uppercase font-bold">Humidity</p>
                    <p className="text-sm font-bold">{weather.relative_humidity_2m}%</p>
                </div>
            </div>
        </div>

        {/* Farmer Advisory Strip */}
        <div className={`mt-6 px-4 py-3 rounded-xl flex items-start gap-3 border backdrop-blur-md ${isRainingSoon ? 'bg-red-500/30 border-red-400/50' : 'bg-green-500/20 border-green-400/30'}`}>
            <div className={`p-1 rounded-full mt-0.5 ${isRainingSoon ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {isRainingSoon ? <AlertTriangle size={14} /> : <Check size={14} />}
            </div>
            <div>
                <p className={`text-xs font-bold uppercase mb-0.5 ${isRainingSoon ? 'text-red-100' : 'text-green-100'}`}>
                    {isRainingSoon ? "Rain Alert" : "Farming Conditions"}
                </p>
                <p className="text-sm leading-tight text-white/90 font-medium">
                    {isRainingSoon 
                        ? "Rain expected in 24h. Postpone spraying fertilizers." 
                        : "Conditions are good for field activities."}
                </p>
            </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayName = i === 0 ? "Today" : i === 1 ? "Tomrw" : date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayCode = forecast.weather_code[i];
                const maxTemp = Math.round(forecast.temperature_2m_max[i]);
                const rainSum = forecast.precipitation_sum[i];
                const dayInfo = getWeatherInfo(dayCode);

                return (
                    <div key={i} className="text-center p-3 rounded-xl bg-black/10 hover:bg-black/20 transition-colors cursor-default">
                        <p className="text-xs font-bold text-white/70 mb-2 uppercase">{dayName}</p>
                        <div className="flex justify-center mb-2">{dayInfo.smallIcon}</div>
                        <p className="text-lg font-bold">{maxTemp}°</p>
                        <p className="text-[10px] text-white/50">{rainSum > 0 ? `${rainSum}mm` : 'Dry'}</p>
                    </div>
                )
            })}
        </div>

      </div>

      <style>{`
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// Simple helper icon for Check
const Check = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default WeatherCard;