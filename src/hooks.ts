import { useEffect, useState } from "react";
import Lenis from "lenis";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function subscribeToScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  window.addEventListener("lenis-scroll", listener);
  return () => {
    window.removeEventListener("scroll", listener);
    window.removeEventListener("lenis-scroll", listener);
  };
}

export function useSmoothScroll(reduced: boolean) {
  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      stopInertiaOnNavigate: true,
    });

    // Keep Lenis updates separate from native scroll events to avoid feeding
    // synthetic events back into Lenis.
    const onLenisScroll = () => {
      window.dispatchEvent(new Event("lenis-scroll"));
    };
    lenis.on("scroll", onLenisScroll);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!target) return;
      const hash = target.getAttribute("href");
      if (!hash || hash === "#") return;
      const destination = document.querySelector<HTMLElement>(hash);
      if (!destination) return;
      event.preventDefault();
      lenis.scrollTo(destination, { offset: hash === "#top" ? 0 : -64 });
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      lenis.off("scroll", onLenisScroll);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reduced]);
}

export function useReveals(reduced: boolean, watch = "") {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reduced, watch]);
}

export function useLocalTime(timeZone = "Asia/Kolkata") {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime(new Date().toLocaleTimeString("en-GB"));
      }
    };
    format();
    const timer = window.setInterval(format, 1000);
    return () => window.clearInterval(timer);
  }, [timeZone]);

  return time;
}
