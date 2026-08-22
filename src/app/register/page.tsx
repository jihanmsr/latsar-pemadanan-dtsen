"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check, ChevronDown, Send, ShieldCheck, FileCheck } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Pendaftaran Berhasil!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
              Data registrasi instansi Anda telah kami terima. Tim PAKEWA akan melakukan verifikasi dokumen dan mengirimkan konfirmasi akun melalui email narahubung.
            </p>
            <Link href="/login" className="inline-flex w-full items-center justify-center py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-lg">
              Kembali ke Halaman Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      <div className="flex-1 flex flex-col xl:flex-row">
      
      {/* LEFT COLUMN - Information / Branding */}
      <div className="hidden xl:flex w-[400px] xl:w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex-col justify-between relative overflow-hidden shrink-0">
        <Link href="/login" className="absolute top-8 left-8 text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Animated Glowing Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]"
          />
          
          {/* Subtle Futuristic Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04]" 
            style={{ 
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent)'
            }}
          />
        </div>

        <div className="mt-20 max-w-xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">
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
              Pendaftaran Instansi Baru
            </h2>
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
              <p>
                Lengkapi formulir pendaftaran untuk mengajukan akun instansi. Pastikan Anda telah menyiapkan dokumen <strong>Surat Pengajuan Permintaan Data</strong> dan dokumen legal lainnya.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-12 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium">Tim kami akan memverifikasi permohonan Anda dalam waktu maksimal 2x24 Jam kerja.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN - Form */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-950 h-full max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center xl:hidden sticky top-0 z-10">
           <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="font-black text-lg text-slate-900 dark:text-white tracking-tight">PAKEWA<span className="text-blue-600">.</span></div>
        </div>

        <div className="flex-1 p-6 md:p-12 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-10 xl:hidden">
               <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                 Pendaftaran Online
               </h1>
               <p className="text-sm text-slate-500 font-medium">Lengkapi data di bawah ini untuk melakukan registrasi akun</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Form Instansi */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">1</span>
                    Data Instansi & Narahubung
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Pilih Kategori Pemohon<span className="text-rose-500">*</span>:
                      </label>
                      <div className="relative">
                        <select required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer">
                          <option value="">-- pilih kategori instansi --</option>
                          <option value="kementerian">Kementerian / Lembaga</option>
                          <option value="provinsi">Pemerintah Provinsi</option>
                          <option value="kabkota">Pemerintah Kabupaten/Kota</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Pilih Nama Instansi<span className="text-rose-500">*</span>:
                      </label>
                      <div className="relative">
                        <select required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer">
                          <option value="">-- pilih instansi --</option>
                          <option value="1">Dinas Sosial Prov. Jawa Tengah</option>
                          <option value="2">Bappeda Prov. Jawa Barat</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Email Narahubung (*.go.id)<span className="text-rose-500">*</span>:
                      </label>
                      <input type="email" required placeholder="admin@instansi.go.id" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Nama Narahubung<span className="text-rose-500">*</span>:
                      </label>
                      <input type="text" required placeholder="Nama Lengkap" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        No Handphone<span className="text-rose-500">*</span>:
                      </label>
                      <input type="tel" required placeholder="08XX XXXX XXXX" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" />
                      <span className="text-xs text-slate-500 font-medium">Format: 08XX XXXX XXXX</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Lampiran Pengajuan Akun<span className="text-rose-500">*</span>:
                      </label>
                      <div className="flex">
                        <label className="px-5 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 border-r-0 rounded-l-xl text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          Pilih File
                          <input type="file" required accept=".pdf" className="hidden" />
                        </label>
                        <div className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-r-xl text-sm text-slate-400 bg-slate-50 dark:bg-slate-900 flex items-center overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                          Belum ada file dipilih...
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 mt-2 block font-medium">Surat Pembuatan Akun (*.pdf) Maksimal 2 MB</span>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                      <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                           <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Saya bukan robot</span>
                         </div>
                         <div className="text-center flex flex-col items-center opacity-80">
                           <img src="/recaptcha-logo.png" width="30" alt="reCaptcha" />
                           <span className="text-[10px] text-slate-500 mt-1 font-bold">reCAPTCHA</span>
                         </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Kirim Pengajuan Pendaftaran
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Pengguna (Tabs) */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">2</span>
                  Data Pengguna Layanan (Minimal 2)
                </h3>
                
                <div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-t-2xl bg-slate-100 dark:bg-slate-900 flex overflow-hidden">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setActiveTab(num)}
                        className={`flex-1 py-4 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                          activeTab === num 
                          ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                          : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800 border-b-2 border-transparent'
                        }`}
                      >
                        User {num}{num <= 2 && <span className="text-rose-500 ml-0.5">*</span>}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-x border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-b-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          NIP/NIK:
                        </label>
                        <input type="text" placeholder="16 digit NIK atau NIP" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Nama Unit Kerja:
                        </label>
                        <input type="text" placeholder="Biro / Bagian" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Nama Lengkap:
                        </label>
                        <input type="text" placeholder="Nama Lengkap dengan Gelar" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          No Handphone:
                        </label>
                        <input type="tel" placeholder="08XX XXXX XXXX" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" />
                        <span className="text-xs text-slate-500 font-medium block">Format: 08XX XXXX XXXX</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Email Pengguna (*.go.id):
                      </label>
                      <input type="email" placeholder="user@instansi.go.id" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Jabatan:
                      </label>
                      <input type="text" placeholder="Nama Jabatan Lengkap" required={activeTab <= 2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" />
                      <span className="text-xs text-slate-500 font-medium block">Contoh: Kepala Badan Perencanaan Pembangunan Daerah Prov. Jateng</span>
                    </div>
                  </div>

                  <div className="mt-6 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-blue-50 dark:bg-blue-900/10">
                    <span className="block text-sm font-black text-blue-900 dark:text-blue-400 mb-2">Penting:</span>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1.5 font-medium">
                      <li>• Data <strong className="font-bold">User 1</strong> dan <strong className="font-bold">User 2</strong> wajib diisi sebagai syarat permohonan.</li>
                      <li>• Field yang ditandai dengan bintang (<span className="text-rose-500">*</span>) wajib diisi.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
