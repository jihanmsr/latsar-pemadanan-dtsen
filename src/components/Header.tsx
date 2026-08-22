"use client";

import { useState, useEffect } from 'react';
import { Bell, UserCircle, CheckCircle2, Sun, Moon, LogOut, Menu, Shield, Building } from 'lucide-react';
import { useMatching } from '@/context/MatchingContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ setIsSidebarOpen }: { setIsSidebarOpen?: (val: boolean) => void }) {
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
    <header className="h-16 glass sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen?.(true)}
          className="p-2 md:hidden rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-muted hover:text-foreground transition-all duration-300"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          {user?.role === 'BPS_ADMIN' ? (
            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800 tracking-tight flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span>Dashboard Admin BPS</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-sm font-bold border border-rose-200 dark:border-rose-800 tracking-tight flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span>Dashboard Instansi</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-muted hover:text-foreground transition-all duration-300"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary" />}
            </motion.div>
          </button>
        )}

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-muted hover:text-foreground transition-all duration-300 relative"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 glass border border-border shadow-xl rounded-xl overflow-hidden z-50"
              >
                <div className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-border px-4 py-3">
                  <h3 className="font-bold text-foreground text-sm">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted text-sm">
                      Tidak ada notifikasi baru.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-border hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${notif.id === 99 ? 'text-primary' : 'text-success'}`} />
                        <div>
                          <p className="text-sm font-bold text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted mt-1">{notif.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 border-l border-border pl-4 ml-2">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-extrabold text-foreground leading-none mb-1">
              {user ? (user.name === 'Admin BPS Pusat' ? 'Admin BPS' : user.name) : 'Tamu'}
            </p>
            <p className="text-xs text-muted font-medium leading-none">
              {user?.role === 'BPS_ADMIN' ? 'BPS Administrator' : (user?.instansi || 'Perwakilan Pemda')}
            </p>
          </div>
          <UserCircle className="w-9 h-9 text-primary-light" />
          <button 
            onClick={logout}
            className="p-2 text-muted hover:text-rose-500 transition-all duration-300 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 ml-1"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
