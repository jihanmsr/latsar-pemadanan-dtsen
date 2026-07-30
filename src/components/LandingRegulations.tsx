import { Gavel, BookOpen, Link as LinkIcon, Scale } from 'lucide-react';

export default function LandingRegulations() {
  const regulations = [
    {
      icon: Gavel,
      title: "INSTRUKSI PRESIDEN",
      subtitle: "Inpres No. 4 Tahun 2025",
      desc: "Tentang Data Tunggal Sosial dan Ekonomi Nasional — mengamanatkan pengelolaan data terintegrasi guna mendukung pembangunan nasional yang terukur dan berkelanjutan.",
      date: "Ditetapkan 2025"
    },
    {
      icon: BookOpen,
      title: "PERATURAN MENTERI PPN",
      subtitle: "Permen PPN No. 7 Tahun 2025",
      desc: "Pedoman Berbagipakai Data Tunggal Sosial dan Ekonomi Nasional — mengatur persyaratan, prosedur, kewajiban, dan wewenang seluruh pihak dalam pemanfaatan DTSEN.",
      date: "Ditetapkan 2025"
    },
    {
      icon: LinkIcon,
      title: "EKOSISTEM DATA",
      subtitle: "Satu Data Indonesia (SDI)",
      desc: "DTSEN merupakan bagian integral dari ekosistem Satu Data Indonesia yang dikelola oleh Kementerian PPN/Bappenas sebagai walidata tingkat pusat.",
      date: "data.go.id"
    }
  ];

  return (
    <div className="w-full py-20 px-4 sm:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Scale className="w-4 h-4" />
            Landasan Hukum
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Dasar Regulasi <span className="text-indigo-600">DTSEN</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto">DTSEN diatur dan dilindungi oleh peraturan resmi pemerintah yang menjamin keakuratan, keamanan, dan keterbukaan data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regulations.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">{item.title}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.subtitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 h-24">{item.desc}</p>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                </div>
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
