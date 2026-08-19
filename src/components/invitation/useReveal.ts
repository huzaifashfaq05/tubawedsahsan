import { useEffect } from "react";

export function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [active]);
}
