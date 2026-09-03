'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Database, AlertCircle, CheckCircle2, XCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function TestMatchPage() {
  const [formData, setFormData] = useState({
    nama: '',
    tanggal_lahir: '',
    jenis_kelamin: '1',
    alamat: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/match-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'Terjadi kesalahan pada server.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'EXACT_MATCH': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200';
      case 'PROBABLE_MATCH': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200';
      case 'WEAK_MATCH': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 border-orange-200';
      default: return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'EXACT_MATCH': return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
      case 'PROBABLE_MATCH': return <AlertCircle className="w-8 h-8 text-amber-500" />;
      case 'WEAK_MATCH': return <AlertCircle className="w-8 h-8 text-orange-500" />;
      default: return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="inline-block p-4 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            Simulator Pemadanan PAKEWA
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Uji performa algoritma <em>Fuzzy Matching</em> secara langsung terhadap Database Master DTSEN. Masukkan data sasaran untuk memperoleh hasil pemadanan beserta skor kemiripan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Sasaran (Input)</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input 
                  type="text" required
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  placeholder="Misal: HABRIZI MALIK FIRDIANSYAH"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir</label>
                  <input 
                    type="date" required
                    value={formData.tanggal_lahir}
                    onChange={e => setFormData({...formData, tanggal_lahir: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                  <select 
                    value={formData.jenis_kelamin}
                    onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  >
                    <option value="1">Laki-laki</option>
                    <option value="2">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat (Opsional)</label>
                <textarea 
                  value={formData.alamat}
                  onChange={e => setFormData({...formData, alamat: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-white h-24 resize-none"
                  placeholder="Misal: Jl. Mangga No 1"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? 'Mencocokkan...' : 'Mulai Pemadanan'}
              </button>
            </form>
          </motion.div>

          {/* Result Panel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center"
                >
                  <Search className="w-12 h-12 mb-4 text-slate-300" />
                  <p>Masukkan data sasaran di sebelah kiri untuk melihat algoritma mencari kembarannya di database Master DTSEN.</p>
                </motion.div>
              )}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700"
                >
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">Menyisir Database MySQL...</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 space-y-6 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-2 ${
                    result.status === 'PROBABLE_MATCH' ? 'bg-amber-500' :
                    result.status === 'WEAK_MATCH' ? 'bg-orange-500' :
                    result.status === 'NO_MATCH' ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Hasil Pemadanan</h3>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {result.score}% MATCH
                          </p>
                          <p className={`text-xs font-bold px-2 py-1 rounded-md inline-block mt-1 border ${getStatusColor(result.status)}`}>
                            {result.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.alasan_anomali && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Catatan Pemadanan</p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{result.alasan_anomali}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.matched_data ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Ditemukan di Master:</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{result.matched_data.nama}</p>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-slate-500">Tanggal Lahir</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{result.matched_data.tanggal_lahir}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Jenis Kelamin</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {result.matched_data.jenis_kelamin === '1' ? 'Laki-laki' : 'Perempuan'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-slate-500">Alamat Master</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {result.matched_data.alamat_lengkap} {result.matched_data.desa_kelurahan}, {result.matched_data.kecamatan}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-center text-slate-400">
                        *Algoritma menyaring {result.total_candidates_checked} kandidat berpotensi dalam waktu singkat.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                      <p className="text-slate-600 dark:text-slate-400">Tidak ada satupun penduduk di Database Master yang tingkat kemiripannya melebihi batas minimal.</p>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}
