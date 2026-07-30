import Link from 'next/link';
import { Database, FileCheck, ShieldCheck, LayoutDashboard, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (val: boolean) => void }) {
  const { user } = useAuth();
  const isBps = user?.role === 'BPS_ADMIN';

  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-transparent p-0 rounded-xl overflow-hidden shrink-0">
              <img src="/logo-pakewa.png" alt="Logo PAKEWA" width="40" height="40" className="object-contain" />
            </div>
            <h1 className="font-extrabold text-2xl leading-tight text-foreground tracking-tight">PAKEWA<span className="text-primary text-3xl">.</span></h1>
          </div>
          <button 
            className="p-1 md:hidden text-muted hover:text-foreground"
            onClick={() => setIsOpen?.(false)}
          >
            <X className="w-5 h-5" />
          </button>
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
    </>
  );
}
