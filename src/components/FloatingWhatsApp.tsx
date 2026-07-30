import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingWhatsApp() {
  // Fix possible typo from user input '0896443q7893' to '089644317893'
  // Or just use wa.me/6289644317893
  const waNumber = "6289644317893";
  const waMessage = "Halo, saya ingin bertanya mengenai layanan PAKEWA.";

  return (
    <Link 
      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-semibold text-sm">Hubungi Kami</span>
    </Link>
  );
}
