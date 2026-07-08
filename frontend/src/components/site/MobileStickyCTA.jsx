import { useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";

export default function MobileStickyCTA() {
  const navigate = useNavigate();
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 p-3"
      data-testid="mobile-sticky-cta"
    >
      <button
        onClick={() => navigate("/contact")}
        className="w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-bold py-3.5 rounded-md flex items-center justify-center gap-2 shadow-lg shadow-[#2ECC71]/30"
        data-testid="sticky-book-now-btn"
      >
        <CalendarCheck className="w-5 h-5" />
        Book Your Cleaning Now
      </button>
    </div>
  );
}
