"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, User, MapPin, Briefcase, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Pencarian Individu Lintas Versi</h2>
        <p className="text-muted">Cari profil penduduk di DTSEN V2 maupun V3 menggunakan NIK atau Nama.</p>
      </div>

      <div className="glass p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan NIK (16 digit) atau Nama..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-foreground"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? 'Mencari...' : 'Cari Data'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {results !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-foreground">Hasil Pencarian ({results.length})</h3>
            
            {results.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border border-dashed">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-muted font-medium">Data tidak ditemukan untuk "{query}"</p>
              </div>
            ) : (
              results.map((r, i) => (
                <div key={i} className="glass p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{r.nama}</h4>
                        <p className="font-mono text-sm text-primary-light font-medium tracking-wide mt-0.5">{r.nik}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium text-foreground">{r.kabupaten}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium text-foreground">{r.statusBekerja}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-center gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Status PBI</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${r.isPbi ? 'bg-success/20 text-success-dark' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {r.isPbi ? 'PBI Nasional' : 'Bukan PBI'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Desil Kesejahteraan</span>
                      <span className="font-black text-xl text-primary">{r.desil}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{r.keterangan}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
