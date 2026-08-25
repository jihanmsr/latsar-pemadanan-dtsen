"use client";

import { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle2, Search, Inbox, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Ticket = {
  id: number;
  nama: string;
  email: string;
  pesan: string;
  status: string;
  created_at: string;
};

export default function AdminInbox() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support/list');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/support/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Inbox className="w-8 h-8 text-blue-600" />
            Kotak Masuk (Support)
          </h1>
          <p className="text-slate-500 mt-2">Pesan dan keluhan dari pendaftar yang tidak terjawab oleh Chatbot.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">Memuat pesan...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Tidak ada pesan baru</h3>
          <p className="text-slate-500 mt-2">Semua pertanyaan pendaftar telah tertangani oleh bot.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {ticket.status === 'OPEN' ? 'BELUM DIBALAS' : 'SELESAI'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleString('id-ID')}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{ticket.nama}</h3>
                <a href={`mailto:${ticket.email}`} className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1.5 mb-4">
                  <Mail className="w-3.5 h-3.5" /> {ticket.email}
                </a>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-700 dark:text-slate-300 text-sm italic border-l-4 border-slate-300 dark:border-slate-700">
                  "{ticket.pesan}"
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                {ticket.status === 'OPEN' ? (
                  <>
                    <a href={`mailto:${ticket.email}?subject=Balasan Support PAKEWA&body=Halo ${ticket.nama},%0D%0A%0D%0AMembalas pertanyaan Anda:%0D%0A"${ticket.pesan}"%0D%0A%0D%0A`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors text-center shadow-sm">
                      Balas Email
                    </a>
                    <button onClick={() => updateStatus(ticket.id, 'RESOLVED')} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 text-sm font-bold rounded-xl transition-colors text-center">
                      Tandai Selesai
                    </button>
                  </>
                ) : (
                  <button onClick={() => updateStatus(ticket.id, 'OPEN')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors text-center">
                    Buka Kembali
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
