import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
  end: number;
  duration?: number; // ms
  suffix?: string;
  className?: string;
}

export function Counter({ end, duration = 1600, suffix = "", className }: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(end);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [started, duration, end]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
