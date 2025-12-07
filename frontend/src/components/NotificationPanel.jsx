import React from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle, Calendar, Trash2, Clock } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose, notifications }) => {
  // Note: Hum "if (!isOpen) return null" hata rahe hain taaki animation kaam kare.
  // Hum CSS classes se show/hide control karenge.

  // Icon helper based on type
  const getStyle = (type) => {
    switch(type) {
        case 'warning': 
            return { icon: <AlertTriangle size={18} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100' };
        case 'success': 
            return { icon: <CheckCircle size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100' };
        default: 
            return { icon: <Info size={18} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100' };
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* 1. Backdrop Overlay (Smooth Fade) */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* 2. Side Panel (Slide Animation) */}
      <div 
        className={`relative w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-l border-white/20
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 to-green-800 text-white flex justify-between items-center shadow-md shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Bell size={22} className="text-yellow-400" />
                    {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-900"></span>}
                </div>
                <div>
                    <h2 className="font-bold text-lg tracking-wide">Notifications</h2>
                    <p className="text-[10px] text-emerald-200 uppercase font-medium tracking-wider">Updates & Alerts</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
            >
                <X size={20} />
            </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 custom-scrollbar">
            {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-slate-100 p-6 rounded-full mb-4">
                        <Bell size={48} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-600 font-bold text-lg">All caught up!</h3>
                    <p className="text-sm">No new notifications for you.</p>
                </div>
            ) : (
                notifications.map((note, index) => {
                    const style = getStyle(note.type);
                    return (
                        <div key={index} className={`relative p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group animate-[fadeIn_0.3s_ease-out]`}>
                            <div className="flex gap-4 items-start">
                                {/* Icon Box */}
                                <div className={`mt-0.5 p-2 rounded-full shrink-0 ${style.iconBg} ${style.color}`}>
                                    {style.icon}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{note.title}</h4>
                                    <p className="text-slate-600 text-xs leading-relaxed">{note.message}</p>
                                    
                                    <div className="flex items-center gap-3 mt-3 border-t border-slate-50 pt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                                            <Calendar size={10} />
                                            {new Date(note.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                            <Clock size={10} />
                                            {new Date(note.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Unread Indicator Dot */}
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    );
                })
            )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <button 
                    onClick={onClose} 
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Clear All Notifications
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;