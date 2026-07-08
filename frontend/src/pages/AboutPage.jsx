import { ShieldCheck, Leaf, Award, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="label-eyebrow mb-3">About Us</div>
          <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Cleaning that goes beyond the surface.
          </h1>
          <p className="mt-5 text-lg text-[#202020]/75 leading-relaxed">
            Fresh Deep Cleaning Service was built on one simple idea — a clean space feels different. For years, we've delivered
            professional deep cleaning that transforms homes, offices, restaurants and workspaces. Our team is trained,
            background-verified, and equipped with modern tools and eco-friendly products.
          </p>
          <p className="mt-4 text-[#202020]/75 leading-relaxed">
            We take pride in the details others miss — behind the fridge, between grout lines, inside vents. Every job ends with
            a walkthrough and a satisfaction check because we don't consider it done until you say so.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { Icon: Award, t: "5+ Years of Experience" },
              { Icon: ShieldCheck, t: "Licensed, Bonded & Insured" },
              { Icon: Leaf, t: "Eco-Friendly Products" },
              { Icon: Sparkles, t: "Satisfaction Guaranteed" },
            ].map(({ Icon, t }, i) => (
              <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-lg p-4 bg-[#F8F9FA]">
                <Icon className="w-5 h-5 text-[#2ECC71]" />
                <div className="font-heading font-semibold text-sm text-[#0B1D33]">{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=1200&q=70"
            alt="Team at work"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[#0B1D33] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="label-eyebrow text-white/60 mb-3">Our Mission</div>
            <p className="text-white/80 leading-relaxed">To give every client a spotless space and the peace of mind that comes with it.</p>
          </div>
          <div>
            <div className="label-eyebrow text-white/60 mb-3">Our Values</div>
            <p className="text-white/80 leading-relaxed">Professionalism, punctuality, honest pricing, and eco-conscious cleaning — always.</p>
          </div>
          <div>
            <div className="label-eyebrow text-white/60 mb-3">Our Promise</div>
            <p className="text-white/80 leading-relaxed">If it's not spotless, we come back. Satisfaction is not optional — it's guaranteed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
