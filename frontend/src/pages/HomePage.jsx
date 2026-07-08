import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, Leaf, BadgeCheck, ArrowRight, Star, Home, Building2, Truck, HardHat,
  ChefHat, Droplets, Wind, ClipboardCheck, CalendarClock, Sparkles, Smile, Award, Wrench,
} from "lucide-react";
import BeforeAfter from "@/components/site/BeforeAfter";
import { SERVICES, ROOMS, GALLERY, TESTIMONIALS } from "@/data/content";
import Counter from "@/components/site/Counter";

const iconMap = {
  Home, Building2, Truck, HardHat, ChefHat, Droplets, Wind, Leaf,
};

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Fresh Deep Cleaning Service | Professional Home & Commercial Cleaning";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Book professional deep cleaning services for homes, offices, kitchens, bathrooms, ducts, and commercial spaces. Get a fresh, spotless space today.";
    if (meta) meta.setAttribute("content", content);
    else {
      const m = document.createElement("meta"); m.name = "description"; m.content = content; document.head.appendChild(m);
    }
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="label-eyebrow mb-4">Precision Deep Cleaning for Every Space</div>
              <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                From Dirty to <span className="text-[#2ECC71]">Spotless</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-[#202020]/80 max-w-xl leading-relaxed">
                Professional Deep Cleaning for Homes and Businesses. Trained cleaners, eco-friendly products, and results you can see.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/contact")}
                  data-testid="hero-book-btn"
                  className="inline-flex items-center justify-center gap-2 bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-semibold px-7 py-4 rounded-md shadow-lg shadow-[#2ECC71]/25 transition-all"
                >
                  Book Your Cleaning Now <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  to="/services"
                  data-testid="hero-services-btn"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#0B1D33] text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white font-heading font-semibold px-7 py-4 rounded-md transition-all"
                >
                  View Our Services
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { Icon: BadgeCheck, text: "Trained & Verified Cleaners" },
                  { Icon: Leaf, text: "Eco-Friendly Cleaning Products" },
                  { Icon: ShieldCheck, text: "Satisfaction Guaranteed" },
                ].map(({ Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Icon className="w-5 h-5 text-[#2ECC71]" />
                    <span className="font-heading font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <BeforeAfter
                beforeSrc={GALLERY[0].before}
                afterSrc={GALLERY[0].after}
                height="h-[380px] md:h-[520px]"
                testId="hero-before-after"
              />
              <div className="mt-3 text-center text-xs text-[#202020]/60">Drag the divider to compare</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#F8F9FA] py-16 lg:py-24" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="label-eyebrow mb-3">What We Do</div>
            <h2 className="font-heading font-black text-[#0B1D33] text-3xl md:text-4xl lg:text-5xl leading-tight">
              Deep-clean services for every space.
            </h2>
            <p className="mt-4 text-[#202020]/75">
              From a full home reset to post-construction rescues — pick a service and we'll take care of the rest.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, idx) => {
              const Icon = iconMap[s.icon] || Sparkles;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-[#2ECC71]/40 transition-all"
                  data-testid={`service-card-${s.key}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-md bg-[#0B1D33] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#2ECC71]" />
                      </div>
                      <h3 className="font-heading font-bold text-[#0B1D33] text-base">{s.title}</h3>
                    </div>
                    <p className="text-sm text-[#202020]/70 leading-relaxed min-h-[3.5rem]">{s.desc}</p>
                    <button
                      onClick={() => navigate("/contact", { state: { service: s.title } })}
                      data-testid={`service-book-${s.key}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-[#2ECC71] hover:gap-2.5 transition-all"
                    >
                      Book Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROOM SHOWCASE */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-10">
            <div className="label-eyebrow mb-3">Room by Room</div>
            <h2 className="font-heading font-black text-[#0B1D33] text-3xl md:text-4xl lg:text-5xl">Every inch, cleaned.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROOMS.map((r) => (
              <div key={r.key} className="rounded-xl overflow-hidden border border-gray-100 group" data-testid={`room-card-${r.key}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-heading font-bold text-[#0B1D33] text-lg">{r.title}</h3>
                  <p className="mt-2 text-sm text-[#202020]/70 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US + COUNTERS */}
      <section className="bg-[#0B1D33] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="label-eyebrow mb-3 text-white/60">Why Choose Us</div>
              <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl">Cleaning done the right way.</h2>
              <p className="mt-4 text-white/70 max-w-lg">
                Every job starts with a checklist and ends with a satisfaction check. We show up on time, in uniform, and ready to work.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  { Icon: Award, t: "Experienced Professionals" },
                  { Icon: Leaf, t: "Eco-Friendly Products" },
                  { Icon: Smile, t: "Satisfaction Guaranteed" },
                  { Icon: Wrench, t: "Advanced Equipment" },
                  { Icon: ShieldCheck, t: "Licensed, Bonded & Insured" },
                ].map(({ Icon, t }, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                    <Icon className="w-5 h-5 text-[#2ECC71] mt-0.5" />
                    <div className="font-heading font-semibold text-sm">{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Counter end={500} suffix="+" label="Happy Clients" />
              <Counter end={1000} suffix="+" label="Jobs Completed" />
              <Counter end={99} suffix="%" label="Satisfaction Rate" />
              <Counter end={5} suffix="+" label="Years Experience" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-10">
            <div className="label-eyebrow mb-3">Reviews</div>
            <h2 className="font-heading font-black text-[#0B1D33] text-3xl md:text-4xl lg:text-5xl">Loved by hundreds of clients.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all" data-testid={`testimonial-${i}`}>
                <div className="flex text-[#E8A317] mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[#202020]/80 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.photo} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-heading font-bold text-[#0B1D33] text-sm">{t.name}</div>
                    <div className="text-xs text-[#202020]/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F8F9FA] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-10">
            <div className="label-eyebrow mb-3">How It Works</div>
            <h2 className="font-heading font-black text-[#0B1D33] text-3xl md:text-4xl lg:text-5xl">Four easy steps to a fresh space.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { Icon: ClipboardCheck, t: "Choose your service", d: "Pick from residential, commercial, deep or specialty cleans." },
              { Icon: CalendarClock, t: "Schedule a date & time", d: "Tell us when it works best — same-day options available." },
              { Icon: Sparkles, t: "We clean your space", d: "Our vetted team arrives on time with the right equipment." },
              { Icon: Smile, t: "Enjoy a fresh, clean space", d: "Walkthrough & satisfaction check before we leave." },
            ].map(({ Icon, t, d }, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6" data-testid={`step-${i + 1}`}>
                <div className="w-12 h-12 rounded-lg bg-[#0B1D33] text-white flex items-center justify-center font-heading font-black text-lg">
                  {i + 1}
                </div>
                <Icon className="w-6 h-6 text-[#2ECC71] mt-4" />
                <h3 className="font-heading font-bold text-[#0B1D33] mt-3">{t}</h3>
                <p className="mt-2 text-sm text-[#202020]/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="font-heading font-black text-[#0B1D33] text-3xl md:text-4xl lg:text-5xl">Ready for a spotless space?</h2>
          <p className="mt-4 text-[#202020]/70 max-w-xl mx-auto">Send us your details — we'll get in touch to confirm your booking.</p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-8 inline-flex items-center gap-2 bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white font-heading font-semibold px-8 py-4 rounded-md shadow-lg shadow-[#2ECC71]/25"
            data-testid="cta-book-now-final"
          >
            Book Your Cleaning Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
