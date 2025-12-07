import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Activity, Volume2, Sparkles } from 'lucide-react';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const [userText, setUserText] = useState("");
  const [botText, setBotText] = useState("नमस्ते! माइक बटन दबाएं और पूछें...");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => { setListening(true); setSpeaking(false); setUserText("सुन रहा हूँ..."); };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setUserText(transcript);
        processCommand(transcript);
      };
      recognition.onend = () => { setListening(false); };
      recognition.onerror = () => { setListening(false); setBotText("माफ़ कीजिये, कुछ सुनाई नहीं दिया।"); };
      recognitionRef.current = recognition;
    }
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const speakBack = (message) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.lang = 'hi-IN';
    speech.rate = 0.9; 
    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);
    setBotText(message);
    window.speechSynthesis.speak(speech);
  };

  const processCommand = (transcript) => {
    if (transcript.includes("bhav") || transcript.includes("rate") || transcript.includes("भाव")) {
        speakBack("अभी लहसुन का भाव ₹19,500 प्रति क्विंटल है।");
    } else if (transcript.includes("mausam") || transcript.includes("weather")) {
        speakBack("सीहोर में मौसम बिल्कुल साफ़ है।");
    } else if (transcript.includes("hello") || transcript.includes("नमस्ते")) {
        speakBack("नमस्ते किसान भाई! मैं आपकी क्या मदद कर सकता हूँ?");
    } else {
        speakBack(`माफ़ कीजिये, मुझे समझ नहीं आया.`);
    }
  };

  const handleToggle = () => {
    if (isOpen) {
        setIsOpen(false);
        window.speechSynthesis.cancel();
        recognitionRef.current?.stop();
    } else {
        setIsOpen(true);
        setBotText("नमस्ते! माइक बटन दबाएं और पूछें...");
        setUserText("");
    }
  };

  const startListening = () => {
    recognitionRef.current ? recognitionRef.current.start() : alert("Voice not supported.");
  };

  return (
    <>
      {/* FLOATING BUTTON (STACKED)
         Mobile: bottom-36 (ChatBot ke upar)
         Desktop: bottom-24 (Normal Stack)
      */}
      <button 
        onClick={handleToggle}
        className={`fixed bottom-36 right-4 md:bottom-24 md:right-8 p-3.5 md:p-4 rounded-full shadow-lg z-40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-white/20 backdrop-blur-sm
        ${isOpen 
            ? 'bg-rose-500 rotate-45' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 animate-[bounce_3s_infinite]'}`}
      >
        {isOpen ? <X className="text-white w-5 h-5 md:w-6 md:h-6" /> : <Mic className="text-white w-5 h-5 md:w-6 md:h-6" />}
      </button>

      {/* OVERLAY REMAINS SAME */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleToggle}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.4s_ease-out] mb-24 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2"><Sparkles size={18} className="text-yellow-300" /><span className="font-bold">Voice Assistant</span></div>
                <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Listening</div>
            </div>
            
            {/* Visualizer */}
            <div className="h-32 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden border-b border-slate-100">
                {listening ? (
                    <div className="flex items-center gap-1 h-8">
                        {[...Array(5)].map((_,i) => <div key={i} className="w-1 bg-rose-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{animationDelay: `${i*0.1}s`}}></div>)}
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                        {speaking ? <Volume2 size={24} className="text-indigo-600 animate-pulse"/> : <Mic size={24} className="text-slate-300"/>}
                    </div>
                )}
                <p className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">{listening ? "Listening..." : "Tap to Speak"}</p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 min-h-[120px]">
                {userText && <div className="flex justify-end"><div className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-sm max-w-[85%]">"{userText}"</div></div>}
                <div className="flex justify-start"><div className="bg-indigo-50 text-indigo-900 border border-indigo-100 px-3 py-2 rounded-xl text-sm max-w-[90%]">{botText}</div></div>
            </div>

            {/* Footer Mic */}
            <div className="p-3 bg-white border-t border-slate-100 flex justify-center">
                <button onClick={startListening} disabled={listening} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${listening ? 'bg-rose-100 text-rose-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'}`}>
                    {listening ? <Activity className="animate-spin" size={24}/> : <Mic size={24}/>}
                </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes wave { 0%, 100% { height: 8px; } 50% { height: 24px; } }`}</style>
    </>
  );
};

export default VoiceAssistant;