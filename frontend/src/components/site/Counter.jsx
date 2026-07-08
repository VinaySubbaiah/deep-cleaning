import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Counter({ end = 100, suffix = "+", label = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="font-heading font-black text-4xl md:text-5xl text-white leading-none">
        {n}
        <span className="text-[#2ECC71]">{suffix}</span>
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/70">{label}</div>
    </motion.div>
  );
}
