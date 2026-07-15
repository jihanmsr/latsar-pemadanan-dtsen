"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Loader2, Building2, CheckCircle2, ArrowRight, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      
      {/* LEFT COLUMN - Information / Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-12 flex-col justify-between border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-black/10">
              <img src="/logo-pakewa.png" alt="PAKEWA Logo" width="48" height="48" className="object-contain" />
            </div>
            <span className="font-black text-3xl tracking-tight text-slate-900 dark:text-white">PAKEWA.</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl xl:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
              Akurasi Data untuk <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600">Kesejahteraan Bersama.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md font-medium leading-relaxed">
              Platform terpadu pemadanan data sosial ekonomi yang dijamin aman, andal, dan tersinkronisasi langsung dengan master data BPS.
            </p>

            <div className="space-y-5">
              {[
                "Verifikasi otomatis standar kependudukan",
                "Probabilistic matching tingkat tinggi",
                "Privasi data (NDA) dijamin sepenuhnya"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success-dark dark:text-success" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <Link href="/sop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all text-slate-800 dark:text-white font-bold group shadow-sm">
            Lihat SOP Publik PAKEWA
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 hover:scale-110 transition-transform text-slate-500 dark:text-slate-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-transparent rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 mb-4 overflow-hidden">
              <img src="/logo-pakewa.png" alt="PAKEWA Logo" width="80" height="80" className="object-contain" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">PAKEWA.</h1>
            <p className="text-sm font-semibold text-muted mt-1">Padanan Kesejahteraan Warga</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Portal Internal</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Selamat Datang</h2>
              <p className="text-slate-500 mt-2 text-sm font-medium">Silakan masuk menggunakan akun instansi Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Instansi</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="name@instansi.go.id"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <a href="https://wa.me/6289644327893?text=Halo%20BPS%20Provinsi%20Sulawesi%20Tengah,%20saya%20ingin%20meminta%20bantuan%20karena%20saya%20mau%20mengubah%20password%20akun%20PAKEWA%20saya." target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline">Lupa Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:text-white font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-primary hover:bg-primary-dark disabled:bg-slate-400 text-white font-black rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>MASUK SEKARANG</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                 Belum punya akun? <br className="sm:hidden" />
                 <a href="https://wa.me/6289644327893?text=Halo%20BPS%20Provinsi%20Sulawesi%20Tengah,%20saya%20ingin%20meminta%20pembuatan%20akun%20PAKEWA%20untuk%20instansi%20saya." target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline transition-colors">
                   Hubungi BPS Provinsi Sulawesi Tengah untuk pembuatan akun instansi.
                 </a>
               </p>
            </div>
          </div>
          
          <p className="text-center mt-8 text-xs font-semibold text-slate-400">
            Sistem Informasi Keamanan Data © 2026<br/>
            Badan Pusat Statistik
          </p>
        </motion.div>
      </div>

    </div>
  );
}
