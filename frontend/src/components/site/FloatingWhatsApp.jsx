import { WHATSAPP_NUMBER } from "@/data/content";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const href = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Fresh Deep Cleaning Service! I'd like to know more about your deep cleaning services."
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 bottom-24 md:bottom-8 right-5 md:right-8 w-14 h-14 rounded-full bg-[#2ECC71] hover:scale-110 transition-transform shadow-xl flex items-center justify-center"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8A317] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E8A317]"></span>
      </span>
    </a>
  );
}
