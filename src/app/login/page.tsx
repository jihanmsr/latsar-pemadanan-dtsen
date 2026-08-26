"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Lock, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PublicNavbar from '@/components/PublicNavbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [forgotMessage, setForgotMessage] = useState('');
  
  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus('idle');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStatus('success');
        setForgotMessage(data.message);
      } else {
        setForgotStatus('error');
        setForgotMessage(data.message || 'Terjadi kesalahan.');
      }
    } catch {
      setForgotStatus('error');
      setForgotMessage('Gagal terhubung ke server.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  Lupa Kata Sandi
                </h3>
                <button onClick={() => setShowForgotModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {forgotStatus === 'success' ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">Email Terkirim!</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{forgotMessage}</p>
                    <button onClick={() => setShowForgotModal(false)} className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">Tutup</button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Masukkan email akun Anda. Kami akan mengirimkan password sementara ke email tersebut.</p>
                    {forgotStatus === 'error' && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 rounded-lg flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-rose-700 dark:text-rose-400">{forgotMessage}</p>
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="email@instansi.go.id"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowForgotModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Batal</button>
                      <button type="submit" disabled={forgotLoading} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                        {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Email'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <PublicNavbar />
      <div className="flex-1 flex flex-col lg:flex-row">
      
      {/* LEFT COLUMN - Information / Branding */}
      <div className="w-full lg:w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Glowing Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]"
          />
          
          {/* Subtle Futuristic Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04]" 
            style={{ 
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent)' // Fades out the grid at the bottom
            }}
          />
        </div>

        <div className="max-w-xl mx-auto w-full relative z-10">
          <div className="mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                Modul Pemadanan DTSEN
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Akses Portal Pemadanan Data Terpadu
            </h2>
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
              <p>
                Platform resmi untuk sinkronisasi dan pemadanan data sasaran program Pemerintah Daerah (Pemda) dengan <strong>Data Tunggal Sosial dan Ekonomi Nasional (DTSEN)</strong>.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-12 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium">Memastikan validasi NIK dan pemeringkatan kesejahteraan berjalan akurat dan aman.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN - Login Form */}
      <div className="w-full lg:w-7/12 bg-white dark:bg-slate-950 flex flex-col justify-center p-8 lg:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Selamat Datang Kembali</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Silakan masuk dengan kredensial instansi Anda.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@instansi.go.id"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white text-sm font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kata Sandi</label>
                <button 
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotStatus('idle'); setForgotEmail(''); }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 mb-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                Ingatkan saya di perangkat ini
              </label>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Instansi belum terdaftar? <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Registrasi Akun Baru</Link>
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
