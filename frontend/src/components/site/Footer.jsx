import { Link } from "react-router-dom";
import { Sparkles, Mail, MapPin, Phone } from "lucide-react";
import { OWNER_EMAIL, WHATSAPP_NUMBER } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-[#0B1D33] text-white pt-16 pb-8" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#2ECC71] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="font-heading font-extrabold">Fresh Deep Cleaning</div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Precision Deep Cleaning for Every Space. Homes, offices and beyond — spotless, sanitized, and eco-friendly.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/services" className="hover:text-[#2ECC71]">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-[#2ECC71]">Before &amp; After</Link></li>
            <li><Link to="/about" className="hover:text-[#2ECC71]">About Us</Link></li>
            <li><Link to="/reviews" className="hover:text-[#2ECC71]">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-[#2ECC71]">Book Now</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm tracking-wider uppercase">Services</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Residential Deep Cleaning</li>
            <li>Commercial Cleaning</li>
            <li>Kitchen &amp; Bathroom</li>
            <li>Duct &amp; Ventilation</li>
            <li>Eco-Friendly Sanitization</li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm tracking-wider uppercase">Contact</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-[#2ECC71]" />+91 {WHATSAPP_NUMBER}</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-[#2ECC71]" />{OWNER_EMAIL}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-[#2ECC71]" />Serving cities across India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/60">
        <div>© {new Date().getFullYear()} Fresh Deep Cleaning Service. All rights reserved.</div>
        <div>Precision Deep Cleaning for Every Space.</div>
      </div>
    </footer>
  );
}
