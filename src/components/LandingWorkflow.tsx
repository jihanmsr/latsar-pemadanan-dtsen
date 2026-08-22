import { FileSignature, DatabaseZap, ServerCog, MailCheck, ListTree } from 'lucide-react';

export default function LandingWorkflow() {
  const steps = [
    {
      icon: FileSignature,
      title: "Pengajuan & Penyerahan Data",
      desc: "Pemerintah Daerah (K/L/D) mengajukan surat permohonan pemadanan ke BPS beserta dokumen kerja sama dan data sasaran.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: DatabaseZap,
      title: "Eksplorasi & Verifikasi",
      desc: "Tim BPS melakukan pengecekan referensi, validasi variabel NIK, dan kesesuaian format metadata.",
      color: "from-indigo-500 to-violet-500"
    },
    {
      icon: ServerCog,
      title: "Pemrosesan & Pemadanan",
      desc: "Pemadanan individu secara deterministik (NIK), validasi data kependudukan, serta pemeringkatan kesejahteraan menggunakan DTSEN versi terbaru.",
      color: "from-violet-500 to-fuchsia-500"
    },
    {
      icon: MailCheck,
      title: "Pengiriman Data Balikan",
      desc: "BPS mengirimkan data hasil padanan balikan beserta manifes, Berita Acara Serah Terima (BAST), dan Non-Disclosure Agreement (NDA).",
      color: "from-fuchsia-500 to-rose-500"
    }
  ];

  return (
    <div className="w-full py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <ListTree className="w-4 h-4" />
            Panduan Layanan
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Cara Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pemadanan Data</span></h2>
          <p className="text-slate-500">Ikuti langkah-langkah berikut untuk mengajukan dan memproses pemadanan data sasaran dengan DTSEN.</p>
        </div>

        <div className="relative mt-8">
          {/* Horizontal Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 rounded-full opacity-20"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                
                {/* Timeline Node Desktop */}
                <div className="hidden lg:flex absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-xl items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 lg:mt-20 h-full flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 dark:text-slate-300 font-bold text-sm flex items-center justify-center mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
