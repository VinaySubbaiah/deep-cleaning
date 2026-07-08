import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Sparkles, Phone } from "lucide-react";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";
import MobileStickyCTA from "@/components/site/MobileStickyCTA";
import Footer from "@/components/site/Footer";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Our Work" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goBook = () => {
    setOpen(false);
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white text-[#202020] font-[Lato,sans-serif]">
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-100"
        data-testid="site-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
            <div className="w-9 h-9 rounded-lg bg-[#0B1D33] flex items-center justify-center group-hover:bg-[#2ECC71] transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-extrabold text-[#0B1D33] text-sm md:text-base">Fresh Deep Cleaning</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#202020]/60">Precision Cleaning</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm font-heading font-semibold transition-colors ${
                  location.pathname === item.to
                    ? "text-[#2ECC71]"
                    : "text-[#0B1D33] hover:text-[#2ECC71]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goBook}
              className="hidden md:inline-flex items-center gap-2 bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-md shadow-md shadow-[#2ECC71]/25 transition-all"
              data-testid="header-book-now-btn"
            >
              <Phone className="w-4 h-4" /> Book Now
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-[#0B1D33]"
              aria-label="Toggle menu"
              data-testid="mobile-menu-toggle"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white" data-testid="mobile-nav">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="py-3 px-2 rounded-md font-heading font-semibold text-[#0B1D33] hover:bg-[#F8F9FA]"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={goBook}
                className="mt-2 bg-[#2ECC71] text-white font-heading font-semibold rounded-md py-3"
                data-testid="mobile-book-now-btn"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCTA />
    </div>
  );
}
