import { useState } from "react";
import { GALLERY, GALLERY_TABS } from "@/data/content";
import BeforeAfter from "@/components/site/BeforeAfter";

export default function GalleryPage() {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? GALLERY : GALLERY.filter((g) => g.category === tab);

  return (
    <div data-testid="gallery-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-3">Our Work</div>
          <h1 className="font-heading font-black text-[#0B1D33] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Before &amp; After Gallery
          </h1>
          <p className="mt-5 text-lg text-[#202020]/75">Drag the slider on each image to compare our results.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" data-testid="gallery-tabs">
          {GALLERY_TABS.map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              data-testid={`gallery-tab-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
                tab === label
                  ? "bg-[#0B1D33] text-white"
                  : "bg-white text-[#0B1D33] border border-gray-200 hover:border-[#2ECC71]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => (
            <div key={g.id} className="rounded-xl overflow-hidden border border-gray-100" data-testid={`gallery-item-${g.id}`}>
              <BeforeAfter
                beforeSrc={g.before}
                afterSrc={g.after}
                height="h-72"
                testId={`gallery-slider-${g.id}`}
              />
              <div className="p-4 bg-white">
                <div className="text-xs uppercase tracking-[0.2em] text-[#202020]/60">Category</div>
                <div className="font-heading font-bold text-[#0B1D33]">{g.category}</div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-10 text-center text-[#202020]/60">No results in this category yet.</div>
        )}
      </section>
    </div>
  );
}
