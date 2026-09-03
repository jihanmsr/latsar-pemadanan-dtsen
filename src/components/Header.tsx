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
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const { matchingProgress, files } = useMatching();
  const { user, logout } = useAuth();
  const isValidated = files && files.length > 0 && files.every(f => f.status === 'success');
  const { theme, setTheme } = useTheme();

  const [pemdaNotifications, setPemdaNotifications] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    if (user?.role === 'BPS_ADMIN' || user?.role === 'BPS_PEGAWAI') {
      fetch('/api/submissions')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            const pending = res.data.filter((s: any) => s.status === 'PENDING');
            setAdminNotifications(pending.map((p: any) => ({
              id: p.id,
              title: 'Pengajuan Baru',
              desc: `${p.user?.instansi || 'Instansi Daerah'} mengunggah ${p.total_rows?.toLocaleString() || 0} data.`
            })));
          }
        }).catch(console.error);
    } else if (user?.role === 'PEMDA') {
      fetch('/api/submissions')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            const needsAction = res.data.filter((s: any) => s.status === 'MATCHING');
            setPemdaNotifications(needsAction.map((p: any) => ({
              id: p.id,
              title: 'Tindakan Diperlukan',
              desc: `Proses matching untuk ${p.file_name} sedang berjalan. Pantau di menu Tracking.`
            })));
          }
        }).catch(console.error);
    }
  }, [user]);

  const notifications = [];

  if (user?.role === 'BPS_ADMIN' || user?.role === 'BPS_PEGAWAI') {
    notifications.push(...adminNotifications);
  } else if (user?.role === 'PEMDA') {
    notifications.push(...pemdaNotifications);
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
          {(user?.role === 'BPS_ADMIN' || user?.role === 'BPS_PEGAWAI') ? (
            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800 tracking-tight flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span>{user?.role === 'BPS_PEGAWAI' ? 'Dashboard Pegawai BPS' : 'Dashboard Admin BPS'}</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-sm font-bold border border-rose-200 dark:border-rose-800 tracking-tight flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span>Dashboard Pemda</span>
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
                className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifikasi</h3>
                  {notifications.length > 0 && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {notifications.length} Baru
                    </span>
                  )}
                </div>
                <div className="max-h-[22rem] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tidak ada notifikasi baru.</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Anda sudah melihat semuanya!</p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 items-start cursor-pointer group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${notif.id === 99 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors leading-tight">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">{notif.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      Tandai semua dibaca
                    </button>
                  </div>
                )}
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
              {(user?.role === 'BPS_ADMIN' || user?.role === 'BPS_PEGAWAI') ? (user.role === 'BPS_PEGAWAI' ? 'Staf Validasi BPS' : 'BPS Administrator') : (user?.instansi || 'Perwakilan Pemda')}
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
