"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
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
  

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <div className="flex-1 bg-[#f3f4f6] dark:bg-slate-950 flex flex-col lg:flex-row">
      
      {/* LEFT COLUMN - Information / Branding */}
      <div className="w-full lg:w-1/2 bg-[#eaeff2] dark:bg-slate-900 p-8 lg:p-16 flex flex-col justify-center">
        <div className="max-w-xl mx-auto w-full">
          {/* Logo Section */}
          <div className="mb-12">
            <div className="mb-2">
              <img src="/logo-pakewa.png" alt="Logo PAKEWA" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Modul Pemadanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">DTSEN</span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              Selamat datang di Modul Pemadanan
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 text-justify leading-relaxed">
              <p>
                Sesuai dengan amanat Permen PPN No. 7 Tahun 2025, Modul Pemadanan <strong>PAKEWA</strong> (Padanan Kesejahteraan Warga) dirancang untuk memfasilitasi K/L/D dalam melakukan sinkronisasi dan pemadanan data sasaran program dengan <strong>Data Tunggal Sosial dan Ekonomi Nasional (DTSEN)</strong>.
              </p>
              <p>
                Platform terpadu ini memastikan proses validasi NIK dan pemeringkatan kesejahteraan berjalan secara cerdas, akurat, dan aman.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN - Login Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-slate-950 flex flex-col p-8 lg:p-16 relative">

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full mt-12 lg:mt-0">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Masuk</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Masukkan email dan kata sandi Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-md text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="text"
                required
                placeholder="-- email --"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="-- kata sandi --"
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 mb-6">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">
                Ingatkan saya
              </label>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-400 text-white font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Masuk
                </>
              )}
            </button>

          </form>

          <div className="mt-8 flex flex-col gap-6 text-sm">
            <Link href="#" className="text-primary hover:underline font-medium">
              Lupa Kata Sandi?
            </Link>
            
            <p className="text-center text-slate-500">
              Belum punya akun? <Link href="/register" className="text-primary font-medium hover:underline">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
