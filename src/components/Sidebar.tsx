import Link from 'next/link';
import Image from 'next/image';
import { Database, FileCheck, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const isBps = user?.role === 'BPS_ADMIN';

  return (
    <aside className="w-64 bg-surface border-r border-border h-full hidden md:flex flex-col transition-colors duration-300 relative z-20">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-transparent p-0 rounded-xl overflow-hidden shrink-0">
          <img src="/logo-pakewa.png" alt="Logo PAKEWA" width="40" height="40" className="object-contain" />
        </div>
        <h1 className="font-extrabold text-2xl leading-tight text-foreground tracking-tight">PAKEWA<span className="text-primary text-3xl">.</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {!isBps && (
          <>
            <Link href="/" className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-muted hover:text-foreground font-semibold transition-all duration-300">
              <Database className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Upload Data</span>
            </Link>
            <Link href="/tracking" className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-muted hover:text-foreground font-semibold transition-all duration-300">
              <FileCheck className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Tracking Progres</span>
            </Link>
          </>
        )}
        
        {isBps && (
          <Link href="/admin/dashboard" className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-muted hover:text-foreground font-semibold transition-all duration-300">
            <LayoutDashboard className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">Dashboard BPS</span>
          </Link>
        )}

        <Link href="/sop" className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-muted hover:text-foreground font-semibold transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary group-hover:scale-110 transition-all duration-300"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8"/><path d="M12 8v6"/><path d="M3 16h5v5"/><path d="M16 16h5v5"/></svg>
          <span className="group-hover:translate-x-1 transition-transform duration-300">SOP Pemadanan</span>
        </Link>
      </nav>
      <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-900/30">
        <div className="text-xs font-bold text-muted flex items-center gap-2 group cursor-default">
          <span className="w-2.5 h-2.5 rounded-full bg-success relative">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></span>
          </span>
          <span className="group-hover:text-foreground transition-colors">Koneksi Terenkripsi</span>
        </div>
      </div>
    </aside>
  );
}
