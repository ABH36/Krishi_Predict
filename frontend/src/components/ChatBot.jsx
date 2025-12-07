import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';

const ChatBot = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "राम-राम किसान भाई! मैं 'किसान मित्र' हूँ। आप मुझसे फसल, दवाई या खेती के बारे में कुछ भी पूछ सकते हैं।" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const t = lang === 'hi' ? {
    placeholder: "अपना सवाल पूछें...",
    header: "किसान मित्र (AI)",
    status: "सहायता के लिए तैयार",
  } : {
    placeholder: "Ask anything...",
    header: "Kisan Mitra (AI)",
    status: "Online & Ready",
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;
      const res = await axios.post(`${API_URL}/api/chat`, { message: userMsg });
      setMessages(prev => [...prev, { type: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: "माफ़ कीजिये, सर्वर से संपर्क नहीं हो पा रहा है।" }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Toggle Button (Calculated Position) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          // CHANGE: Mobile par 'bottom-20' (Nav ke upar), Desktop par 'md:bottom-8'
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 group"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-4 md:p-4 rounded-full shadow-2xl shadow-emerald-600/40 transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
            <MessageCircle size={24} className="animate-pulse-slow" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </button>
      )}

      {/* Chat Window Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Chat Window Container */}
      <div className={`
        fixed z-50 transition-all duration-300 ease-out transform
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}
        // CHANGE: Mobile Height/Pos fixed
        bottom-20 left-4 right-4 
        md:left-auto md:bottom-24 md:right-8 md:w-96 
        bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col
        h-[60vh] md:h-[550px]
      `}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Bot size={20} className="text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-base flex items-center gap-2">{t.header}</h3>
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-medium tracking-wide">{t.status}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scroll-smooth custom-scrollbar">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'bot' && (
                     <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0"><Bot size={14} className="text-emerald-600"/></div>
                  )}
                  <div className={`max-w-[85%] p-3 text-sm shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><Bot size={14} className="text-emerald-600"/></div>
                   <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <input 
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-300 text-slate-500'}`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
      </div>
    </>
  );
};

export default ChatBot;