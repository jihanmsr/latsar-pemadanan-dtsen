"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Trash2, Tag, MessageSquare, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatbotManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [reply, setReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch('/api/admin/knowledge');
      const data = await res.json();
      setKnowledgeList(data);
    } catch (error) {
      toast.error('Gagal memuat basis pengetahuan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim() || !reply.trim()) {
      toast.error('Kata kunci dan jawaban harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, reply }),
      });

      if (res.ok) {
        toast.success('Pengetahuan baru berhasil ditambahkan');
        setKeywords('');
        setReply('');
        fetchKnowledge();
      } else {
        toast.error('Gagal menambahkan data');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pengetahuan ini?')) return;

    try {
      const res = await fetch(`/api/admin/knowledge?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Pengetahuan berhasil dihapus');
        fetchKnowledge();
      } else {
        toast.error('Gagal menghapus data');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  if (!mounted || !user || (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) return null;

  const filteredList = knowledgeList.filter(k => 
    k.keywords.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) || 
    k.reply.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Bot className="w-6 h-6 text-indigo-500" />
            </div>
            Manajemen Pengetahuan AI
          </h2>
          <p className="text-muted">Kelola pertanyaan dan referensi jawaban untuk Chatbot Asisten Virtual PAKEWA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Tambah */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 border border-border shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-success" />
              Latih AI Baru
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Kata Kunci (pisahkan dengan koma)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="misal: syarat, panduan, apa itu"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Jawaban Chatbot
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted" />
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Masukkan jawaban yang akan diberikan oleh chatbot..."
                    rows={6}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    Simpan ke Otak AI
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Pengetahuan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dalam basis pengetahuan..."
              className="w-full pl-9 pr-4 py-3 glass border border-border shadow-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredList.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-muted border border-border">
                Tidak ada data yang cocok.
              </div>
            ) : (
              <AnimatePresence>
                {filteredList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-xl p-5 border border-border shadow-sm group hover:border-primary/30 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap gap-1.5">
                          {item.keywords.map((kw: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-slate-200/50 dark:bg-slate-800/50 text-foreground text-xs rounded-md font-semibold font-mono border border-border">
                              {kw}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed border-l-2 border-primary">
                          {item.reply}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
