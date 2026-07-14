"use client";

import { useState, useEffect } from 'react';
import { Bell, UserCircle, CheckCircle2, Sun, Moon, LogOut } from 'lucide-react';
import { useMatching } from '@/context/MatchingContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { matchingProgress, files } = useMatching();
  const { user, logout } = useAuth();
  const isValidated = files && files.length > 0 && files.every(f => f.status === 'success');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const notifications = [];
  
  if (user?.role === 'PEMDA') {
    notifications.push({ id: 99, title: "Tindakan Diperlukan", desc: `Silakan lengkapi manifes untuk data ${user.instansi || 'instansi'}.` });
  }

  if (matchingProgress === 100) {
    notifications.push({ id: 2, title: "Matching Selesai", desc: "Proses pemadanan data telah mencapai 100%." });
  }
  if (isValidated) {
    notifications.push({ id: 1, title: "Validasi Berhasil", desc: "File data sasaran berhasil melewati pra-validasi." });
  }

  const hasUnread = notifications.length > 0;

  return (
    <header className="h-16 bg-surface border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block tracking-tight">Dashboard Instansi</h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden z-50"
              >
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                      Tidak ada notifikasi baru.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${notif.id === 99 ? 'text-primary' : 'text-success'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4 ml-2">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-none mb-1">
              {user ? user.name : 'Tamu'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
              {user?.role === 'BPS_ADMIN' ? 'BPS Administrator' : (user?.instansi || 'Perwakilan Pemda')}
            </p>
          </div>
          <UserCircle className="w-9 h-9 text-blue-200 dark:text-blue-400" />
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
