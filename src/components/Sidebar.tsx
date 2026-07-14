import Link from 'next/link';
import { Database, FileCheck, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const isBps = user?.role === 'BPS_ADMIN';

  return (
    <aside className="w-64 bg-surface border-r border-border h-full hidden md:flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="font-extrabold text-2xl leading-tight text-foreground tracking-tight">PAKEWA<span className="text-primary text-3xl">.</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {!isBps && (
          <>
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary text-slate-700 dark:text-slate-300 font-semibold transition-colors">
              <Database className="w-5 h-5 text-slate-400" />
              Upload Data
            </Link>
            <Link href="/tracking" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary text-slate-700 dark:text-slate-300 font-semibold transition-colors">
              <FileCheck className="w-5 h-5 text-slate-400" />
              Tracking Progres
            </Link>
          </>
        )}
        
        {isBps && (
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary text-slate-700 dark:text-slate-300 font-semibold transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Dashboard BPS
          </Link>
        )}

        <Link href="/workflow" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary text-slate-700 dark:text-slate-300 font-semibold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8"/><path d="M12 8v6"/><path d="M3 16h5v5"/><path d="M16 16h5v5"/></svg>
          SOP Pemadanan
        </Link>
      </nav>
      <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-900/50">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          Koneksi Terenkripsi
        </div>
      </div>
    </aside>
  );
}
