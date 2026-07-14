"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Loader2, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 relative z-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6 rotate-3">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center tracking-tight">
              PAKEWA
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Padanan Kesejahteraan Warga</p>
            <div className="flex items-center gap-2 mt-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                Internal Akses Instansi
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2"
              >
                <Lock className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Instansi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@instansi.go.id"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all dark:text-white font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all dark:text-white font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>MASUK KE SISTEM</span>
                  <Lock className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
              Sistem Informasi Keamanan Data © 2026<br/>
              Badan Pusat Statistik
            </p>
          </div>
        </div>
        
        {/* Help text */}
        <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          Lupa akses atau butuh akun baru? <br/>
          <span className="font-bold text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4">Hubungi BPS Admin Wilayah</span>
        </p>
      </motion.div>
    </div>
  );
}
