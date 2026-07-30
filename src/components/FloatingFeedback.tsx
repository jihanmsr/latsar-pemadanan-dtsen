"use client";

import { useState } from 'react';
import { MessageSquare, X, Frown, Meh, Smile, SmilePlus, Angry } from 'lucide-react';

export default function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const ratings = [
    { icon: Angry, label: 'Sangat Tidak Puas', value: 1 },
    { icon: Frown, label: 'Tidak Puas', value: 2 },
    { icon: Meh, label: 'Cukup', value: 3 },
    { icon: Smile, label: 'Puas', value: 4 },
    { icon: SmilePlus, label: 'Sangat Puas', value: 5 },
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-full shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-semibold text-sm">Kotak Saran</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Rating Layanan Keseluruhan</h3>
                  <p className="text-sm text-slate-500">Bagikan penilaian Anda terhadap layanan PAKEWA.</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="text-center text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300">
                Seberapa puas Anda dengan layanan kami?
              </div>
              
              <div className="flex justify-between mb-6">
                {ratings.map((r) => (
                  <button 
                    key={r.value}
                    onClick={() => setRating(r.value)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${rating === r.value ? 'text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:scale-105'}`}
                  >
                    <r.icon className="w-10 h-10 stroke-[1.5]" />
                    <span className="text-[10px] uppercase font-bold text-center max-w-[60px] leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>

              {!rating && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-center text-xs text-slate-500 mb-6 border border-slate-100 dark:border-slate-700/50">
                  Arahkan kursor atau klik salah satu emoticon untuk memberi penilaian.
                </div>
              )}

              <div className="mb-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Komentar <span className="text-slate-400 font-normal">(opsional)</span></label>
                <p className="text-xs text-slate-500 mb-2">Ceritakan pengalaman Anda agar kami dapat meningkatkan kualitas layanan.</p>
                <textarea 
                  rows={4} 
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Tuliskan saran atau masukan Anda di sini..."
                ></textarea>
                <div className="text-right text-xs text-slate-400 mt-1">0/1000</div>
              </div>

              {/* Fake ReCaptcha */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3 flex items-center justify-between w-[280px] bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-slate-300 bg-white rounded-sm"></div>
                    <span className="text-sm font-medium">I'm not a robot</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 flex flex-col items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1">reCAPTCHA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="font-bold">🔒</span> Pengiriman bersifat anonim. IP tidak disimpan terbuka.
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button 
                  className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-md"
                >
                  Kirim Masukan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
