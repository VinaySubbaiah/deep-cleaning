import { useNavigate } from "react-router-dom";
import { ArrowRight, Home, Building2, Truck, HardHat, ChefHat, Droplets, Wind, Leaf, Sparkles } from "lucide-react";
import { SERVICES } from "@/data/content";

const iconMap = { Home, Building2, Truck, HardHat, ChefHat, Droplets, Wind, Leaf };

export default function ServicesPage() {
  const navigate = useNavigate();
  return (
    <div data-testid="services-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-3">Our Services</div>
          <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Premium deep cleaning, tailored to your space.
          </h1>
          <p className="mt-5 text-lg text-[#202020]/75">
            Choose from our full range of specialized cleaning services. Every job is customized to your space, needs and schedule.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = iconMap[s.icon] || Sparkles;
            return (
              <div
                key={s.key}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-[#2ECC71]/40 transition-all"
                data-testid={`services-page-card-${s.key}`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-md bg-[#0B1D33] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#2ECC71]" />
                    </div>
                    <h3 className="font-heading font-bold text-[#0B1D33]">{s.title}</h3>
                  </div>
                  <p className="text-sm text-[#202020]/70 leading-relaxed">{s.desc}</p>
                  <button
                    onClick={() => navigate("/contact", { state: { service: s.title } })}
                    className="mt-5 inline-flex items-center gap-2 bg-[#2ECC71] text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-[#2ECC71]/90"
                    data-testid={`services-page-book-${s.key}`}
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
