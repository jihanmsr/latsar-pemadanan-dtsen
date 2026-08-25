"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function JumpingMascot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-24 left-8 z-[100] pointer-events-auto scale-110 sm:scale-125 origin-top-left">
      <motion.div
        animate={{
          y: (isHovered || isOpen) ? [-20, 0, -20] : [0, -10, 0],
        }}
        transition={{
          duration: (isHovered || isOpen) ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        {/* Chat bubble that appears on hover (hidden when menu is open) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8, y: isHovered ? 0 : -10 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 pointer-events-none text-center"
            >
              Halo! Aku Asisten PAKEWA
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cute Robot SVG */}
        <div className="w-20 h-20 drop-shadow-2xl">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g transform="translate(100, 100)">
              {/* Antenna */}
              <motion.line 
                x1="0" y1="-50" x2="0" y2="-75" 
                stroke="#64748b" strokeWidth="4" strokeLinecap="round" 
              />
              <motion.circle 
                animate={{ fill: (isHovered || isOpen) ? ["#ef4444", "#3b82f6", "#ef4444"] : "#ef4444" }}
                transition={{ duration: 1, repeat: Infinity }}
                cx="0" cy="-75" r="8" 
              />
              
              {/* Head */}
              <rect x="-45" y="-50" width="90" height="70" rx="20" fill="#3b82f6" />
              <rect x="-35" y="-35" width="70" height="40" rx="10" fill="#0f172a" />
              
              {/* Eyes */}
              <motion.circle 
                animate={{ scaleY: (isHovered || isOpen) ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.2, repeat: (isHovered || isOpen) ? Infinity : 0, repeatDelay: 1 }}
                cx="-15" cy="-15" r="6" fill="#60a5fa" 
              />
              <motion.circle 
                animate={{ scaleY: (isHovered || isOpen) ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.2, repeat: (isHovered || isOpen) ? Infinity : 0, repeatDelay: 1 }}
                cx="15" cy="-15" r="6" fill="#60a5fa" 
              />
              
              {/* Arms */}
              <motion.path 
                animate={{ rotate: (isHovered || isOpen) ? [0, -30, 0] : 0, originX: 0, originY: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                d="M -45 -10 Q -65 -10 -65 10" 
                fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
              />
              <motion.path 
                animate={{ rotate: (isHovered || isOpen) ? [0, 30, 0] : 0, originX: 0, originY: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                d="M 45 -10 Q 65 -10 65 10" 
                fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
              />
              
              {/* Body / Base */}
              <path d="M -25 20 L 25 20 L 35 50 L -35 50 Z" fill="#94a3b8" />
              
              {/* Wheels / Thruster */}
              <motion.circle 
                animate={{ scale: (isHovered || isOpen) ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                cx="-20" cy="50" r="8" fill="#cbd5e1" 
              />
              <motion.circle 
                animate={{ scale: (isHovered || isOpen) ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                cx="20" cy="50" r="8" fill="#cbd5e1" 
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Assistive Touch Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
            className="absolute top-24 left-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 w-48 flex flex-col gap-1"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pusat Bantuan</span>
            </div>
            
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-chatbot'));
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">🤖</span>
              </div>
              <span className="text-xs font-bold">Tanya AI PAKEWA</span>
            </button>
            
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">💬</span>
              </div>
              <span className="text-xs font-bold">Live Chat WA</span>
            </a>
            
            <a
              href="/sop"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-sm">📖</span>
              </div>
              <span className="text-xs font-bold">Buku Panduan</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
