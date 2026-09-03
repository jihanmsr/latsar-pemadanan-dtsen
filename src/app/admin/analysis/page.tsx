"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Table as TableIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AnalysisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [excelType, setExcelType] = useState<'desil' | 'v4'>('desil');
  const [excelData, setExcelData] = useState<{headers: string[], rows: any[], total: number, page: number, totalPages: number} | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelPage, setExcelPage] = useState(1);

  useEffect(() => {
    setMounted(true);
    if (user && (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'BPS_ADMIN') {
      fetchExcelData(excelType, excelPage);
    }
  }, [excelType, excelPage, user]);

  const fetchExcelData = async (type: 'desil' | 'v4', page: number) => {
    setExcelLoading(true);
    try {
      const res = await fetch(`/api/admin/excel-data?type=${type}&page=${page}&limit=50`);
      const json = await res.json();
      if (json.success) {
        setExcelData(json.data);
      } else {
        toast.error(json.message);
      }
    } catch (e) {
      toast.error('Gagal mengambil data Excel');
    } finally {
      setExcelLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 space-y-8 font-sans pb-32">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <TableIcon className="w-8 h-8 text-blue-600" /> Data Hasil Analisis & Pemadanan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Tabel pembacaan dinamis langsung dari database (Tabel matching_results).</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => { setExcelType('desil'); setExcelPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${excelType === 'desil' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Cek Desil All
            </button>
            <button
              onClick={() => { setExcelType('v4'); setExcelPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${excelType === 'v4' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Pemadanan V4
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 relative">
          {excelLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          )}
          
          {!excelData ? null : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-0 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">No.</th>
                  {excelData.headers.map((h, i) => (
                    <th key={i} className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {excelData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-500 font-mono">
                      {(excelPage - 1) * 50 + i + 1}
                    </td>
                    {excelData.headers.map((h, j) => (
                      <td key={j} className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                        {row[h] !== null && row[h] !== undefined ? (
                          h === 'Status Padan' ? (
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${row[h] === 'EXACT_MATCH' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {row[h]}
                            </span>
                          ) : (
                            String(row[h])
                          )
                        ) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                {excelData.rows.length === 0 && (
                  <tr>
                    <td colSpan={excelData.headers.length + 1} className="px-6 py-16 text-center text-slate-500 font-medium">
                      Data kosong atau tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {excelData && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
            <div className="text-sm text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-700 dark:text-slate-300">{(excelPage - 1) * 50 + 1}-{Math.min(excelPage * 50, excelData.total)}</strong> dari <strong className="text-slate-700 dark:text-slate-300">{excelData.total.toLocaleString('id-ID')}</strong> baris
            </div>
            <div className="flex gap-2">
              <button 
                disabled={excelPage <= 1}
                onClick={() => setExcelPage(p => Math.max(1, p - 1))}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button 
                disabled={excelPage >= excelData.totalPages}
                onClick={() => setExcelPage(p => Math.min(excelData.totalPages, p + 1))}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}