"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function JumpingMascot() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-24 left-8 z-50 pointer-events-auto scale-110 sm:scale-125 origin-bottom-left">
      <motion.div
        animate={{
          y: isHovered ? [-20, 0, -20] : [0, -10, 0],
        }}
        transition={{
          duration: isHovered ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative cursor-pointer group"
      >
        {/* Chat bubble that appears on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8, y: isHovered ? 0 : 10 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 pointer-events-none text-center"
        >
          Halo Kak! Aku asisten PAKEWA! 🚀
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 rotate-45" />
        </motion.div>

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
                animate={{ fill: isHovered ? ["#ef4444", "#3b82f6", "#ef4444"] : "#ef4444" }}
                transition={{ duration: 1, repeat: Infinity }}
                cx="0" cy="-75" r="8" 
              />
              
              {/* Head */}
              <rect x="-45" y="-50" width="90" height="70" rx="20" fill="#3b82f6" />
              <rect x="-35" y="-35" width="70" height="40" rx="10" fill="#0f172a" />
              
              {/* Eyes */}
              <motion.circle 
                animate={{ scaleY: isHovered ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
                cx="-15" cy="-15" r="6" fill="#60a5fa" 
              />
              <motion.circle 
                animate={{ scaleY: isHovered ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
                cx="15" cy="-15" r="6" fill="#60a5fa" 
              />
              
              {/* Arms */}
              <motion.path 
                animate={{ rotate: isHovered ? [0, -30, 0] : 0, originX: 0, originY: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                d="M -45 -10 Q -65 -10 -65 10" 
                fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
              />
              <motion.path 
                animate={{ rotate: isHovered ? [0, 30, 0] : 0, originX: 0, originY: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                d="M 45 -10 Q 65 -10 65 10" 
                fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
              />
              
              {/* Body / Base */}
              <path d="M -25 20 L 25 20 L 35 50 L -35 50 Z" fill="#94a3b8" />
              
              {/* Wheels / Thruster */}
              <motion.circle 
                animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                cx="-20" cy="50" r="8" fill="#cbd5e1" 
              />
              <motion.circle 
                animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                cx="20" cy="50" r="8" fill="#cbd5e1" 
              />
            </g>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
