"use client";

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'Halo! Saya asisten virtual Pemadanan Data. Ada yang bisa saya bantu?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let botReply = "Maaf, saya kurang mengerti. Silakan cek bagian FAQ atau hubungi Call Center.";
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('lama') || lowerInput.includes('sla') || lowerInput.includes('waktu')) {
        botReply = "Proses pemadanan memakan waktu antara 1 hingga 5 hari kerja (SLA).";
      } else if (lowerInput.includes('format') || lowerInput.includes('file') || lowerInput.includes('excel')) {
        botReply = "Anda bisa mengunggah format .csv, .xlsx, atau gambar (.png/.jpg) untuk ekstraksi otomatis NIK.";
      } else if (lowerInput.includes('unduh') || lowerInput.includes('kunci') || lowerInput.includes('download')) {
        botReply = "Tombol unduh akan terbuka otomatis setelah proses 100% selesai dan dokumen BAST & NDA dicentang/diunggah.";
      } else if (lowerInput.includes('halo') || lowerInput.includes('hi') || lowerInput.includes('pagi')) {
        botReply = "Halo! Silakan unggah data Anda di halaman utama jika Anda ingin memulai.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            <div className="bg-blue-600 px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Asisten Virtual DTSEN</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-500 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 flex flex-col">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-200">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan..." 
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 dark:text-slate-900 bg-white"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
