import Link from 'next/link';
import { Database, FileText, Send, Table as TableIcon, FolderArchive, FileCheck, ShieldCheck, LayoutDashboard, X, Search, BarChart2, Bot, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (val: boolean) => void }) {
  const { user } = useAuth();
  const isBps = (user?.role === 'BPS_ADMIN' || user?.role === 'BPS_PEGAWAI');

  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [pathname, setIsOpen]);

  const NavItem = ({ href, icon: Icon, label, customIcon }: any) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`group flex items-center gap-3 p-3 rounded-lg font-semibold transition-all duration-300 ${
          isActive 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20' 
            : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        {customIcon ? (
          <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'} transition-colors duration-300`}>
            {customIcon}
          </span>
        ) : (
          <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'} group-hover:scale-110 transition-all duration-300`} />
        )}
        <span className={`${!isActive && 'group-hover:translate-x-1'} transition-transform duration-300`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden`}>
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-40 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="p-6 flex items-center justify-between border-b border-border relative z-10 bg-surface/80 backdrop-blur-sm">
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
      <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
        {!isBps && (
          <>
            <NavItem href="/dashboard" icon={Database} label="Upload Data" />
            <NavItem href="/tracking" icon={FileCheck} label="Tracking Progres" />
            <NavItem 
              href="/sop" 
              label="SOP Pemadanan" 
              customIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-all duration-300"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8"/><path d="M12 8v6"/><path d="M3 16h5v5"/><path d="M16 16h5v5"/></svg>
              } 
            />
          </>
        )}
        
        {isBps && (
          <>
            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard BPS" />
            {user?.role === 'BPS_ADMIN' && <NavItem href="/admin/registrations" icon={Building2} label="Verifikasi Instansi" />}
            <NavItem href="/admin/submissions" icon={FileText} label="Daftar Pengajuan" />
            <NavItem href="/admin/analysis" icon={TableIcon} label="Hasil Analisis" />
            <NavItem href="/admin/requests" icon={Send} label="Pencarian NIK (Kebutuhan SE)" />
            <NavItem href="/admin/archives" icon={FolderArchive} label="Arsip Dokumen" />
            <NavItem href="/admin/search" icon={Search} label="Pencarian Individu" />
            <NavItem href="/admin/compare" icon={BarChart2} label="Komparasi V2 & V3" />
            {user?.role === 'BPS_ADMIN' && <NavItem href="/admin/chatbot" icon={Bot} label="Manajemen AI" />}
          </>
        )}


      </nav>
      <div className="p-6 border-t border-border bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm relative z-10">
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
