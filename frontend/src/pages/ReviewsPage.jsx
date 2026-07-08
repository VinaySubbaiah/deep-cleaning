import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";

const EXTRA = [
  { name: "Sneha Iyer", role: "Villa Owner", quote: "The team spent an entire day scrubbing our kitchen and bathrooms. Grout looks new!", rating: 5, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=70" },
  { name: "Rohit Kapoor", role: "Restaurant Owner", quote: "We use them monthly for deep-cleaning the kitchen and exhaust. Excellent service.", rating: 5, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70" },
  { name: "Meera Nair", role: "IT Professional", quote: "Duct cleaning made a real difference — much less dust in the home now.", rating: 5, photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=300&q=70" },
];

export default function ReviewsPage() {
  const all = [...TESTIMONIALS, ...EXTRA];
  return (
    <div data-testid="reviews-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-3">Reviews</div>
          <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            What our clients say.
          </h1>
          <p className="mt-5 text-lg text-[#202020]/75">Real stories from real homes and businesses.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all" data-testid={`review-card-${i}`}>
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
      </section>
    </div>
  );
}
