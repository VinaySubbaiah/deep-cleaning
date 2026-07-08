import { useRef, useState, useEffect } from "react";
import { ChevronsLeftRight } from "lucide-react";

export default function BeforeAfter({ beforeSrc, afterSrc, height = "h-[60vh] md:h-[70vh]", testId = "before-after" }) {
  const containerRef = useRef(null);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = (clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, p)));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  const start = (e) => {
    setDragging(true);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setFromClientX(x);
  };

  return (
    <div
      ref={containerRef}
      className={`ba-container rounded-2xl shadow-2xl bg-black ${height}`}
      onMouseDown={start}
      onTouchStart={start}
      data-testid={testId}
    >
      {/* After image (full width, base layer) */}
      <img src={afterSrc} alt="After" className="ba-img" />
      <div className="ba-label" style={{ right: "12px" }}>After</div>

      {/* Before image (clipped by pct) */}
      <img
        src={beforeSrc}
        alt="Before"
        className="ba-img"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)`, WebkitClipPath: `inset(0 ${100 - pct}% 0 0)`, zIndex: 2 }}
      />
      <div className="ba-label" style={{ left: "12px", zIndex: 3, display: pct > 5 ? "block" : "none" }}>Before</div>

      {/* Divider handle */}
      <div className="ba-handle" style={{ left: `calc(${pct}% - 1.5px)` }}>
        <div className="ba-handle-dot">
          <ChevronsLeftRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
