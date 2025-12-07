import React from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Calendar, AlertCircle, Info } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';

// Chart.js registration
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
);

const PriceChart = ({ data, cropName }) => {
  
  // 1. DYNAMIC DATE LOGIC (Fixes the date issue)
  // Backend date ko ignore karke, hum aaj se +30 din generate kar rahe hain
  const chartLabels = data.map((_, index) => {
      const d = new Date();
      d.setDate(d.getDate() + index); // Aaj + index days
      return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  });

  // 2. TREND CALCULATION FOR AI ADVICE
  const startPrice = data[0]?.price || 0;
  const endPrice = data[data.length - 1]?.price || 0;
  const isUp = endPrice >= startPrice; // True agar bhav badh raha hai
  const priceDiff = Math.abs(endPrice - startPrice);

  // --- CHART DATA CONFIGURATION ---
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: `${cropName} Price (₹/Q)`,
        data: data.map(item => item.price),
        borderColor: isUp ? '#10b981' : '#f43f5e', // Green if up, Red if down
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          if(isUp) {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          } else {
            gradient.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
            gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
          }
          return gradient;
        },
        tension: 0.4, // Smooth curve
        fill: true,
        borderWidth: 3,
        pointRadius: 0, // Dots hidden for clean look
        pointHoverRadius: 6, // Hover par dot dikhega
        pointBackgroundColor: '#ffffff',
        pointBorderColor: isUp ? '#10b981' : '#f43f5e',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, 
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 14, weight: 'bold' },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
           label: (context) => `₹${context.parsed.y} / Quintal`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#f1f5f9',
          borderDash: [5, 5], 
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#94a3b8',
          callback: (value) => `₹${value}` 
        },
        border: { display: false } 
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 10 },
          color: '#94a3b8',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6 
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Price Forecast <span className="text-slate-400 font-normal text-sm">/ Next 30 Days</span>
          </h3>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
             <Calendar size={12} /> AI Prediction based on Market Data
          </p>
        </div>
        
        {/* Trend Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
           {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
           {isUp ? `+₹${priceDiff} Growth` : `-₹${priceDiff} Drop`}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[250px] md:h-[320px] w-full">
         <Line data={chartData} options={options} />
      </div>

      {/* AI ADVICE STRIP (Decision Helper) */}
      <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 relative overflow-hidden ${isUp ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
         {/* Icon Box */}
         <div className={`p-2 rounded-full shrink-0 ${isUp ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
            {isUp ? <TrendingUp size={20} /> : <AlertCircle size={20} />}
         </div>
         
         {/* Text Content */}
         <div className="relative z-10">
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isUp ? 'text-emerald-700' : 'text-orange-700'}`}>
                AI Suggestion (AI सलाह)
            </p>
            <h4 className={`text-sm font-bold leading-tight ${isUp ? 'text-emerald-900' : 'text-orange-900'}`}>
                {isUp 
                  ? "Hold your crop. Prices are expected to rise." 
                  : "Consider selling soon. Prices may drop."}
            </h4>
            <p className={`text-xs mt-1 opacity-80 ${isUp ? 'text-emerald-800' : 'text-orange-800'}`}>
                {isUp 
                  ? "फसल रोक कर रखें, आगे अच्छे भाव मिलने की उम्मीद है।" 
                  : "भाव गिर सकते हैं, अभी बेचना फायदेमंद हो सकता है।"}
            </p>
         </div>

         {/* Background Decor */}
         <div className="absolute right-0 top-0 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl -mr-6 -mt-6"></div>
      </div>

    </div>
  );
};

export default PriceChart;