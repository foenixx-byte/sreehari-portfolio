import { useEffect, useState } from "react";
import { useLocalTime } from "../hooks";
import type { LayoutVariant } from "../data";

const navigation = [
  { label: "Work", href: "#work", id: "work" },
  { label: "About", href: "#about", id: "about" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Services", href: "#services", id: "services" },
];

type HeaderProps = {
  layout: LayoutVariant;
};

export default function Header({ layout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const time = useLocalTime();

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const sections = ["work", "about", "education", "services", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [layout]);

  return (
    <>
      <header className="site-header">
        <a className="site-logo" href="#top" aria-label="Sreehari, back to top" data-cursor="Top">
          Sree<span>h</span>ari<i />
        </a>
        <div className="header-place micro" aria-label={`Kerala, India. Local time ${time}`}>
          <span className="availability-dot" /> Kerala, IN <span className="header-time">{time || "00:00:00"}</span>
        </div>
        <nav className="desktop-nav micro" aria-label="Main navigation">
          {navigation.map((item) => (
            <a href={item.href} key={item.id} className={active === item.id ? "active" : ""} aria-current={active === item.id ? "location" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-cta jelly-control micro" href="#contact">Let&apos;s talk <span>↗</span></a>
        <button className="menu-toggle micro" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
          <span className={open ? "menu-icon open" : "menu-icon"} aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Mobile navigation">
            {[{ label: "Home", href: "#top", id: "top" }, ...navigation, { label: "Contact", href: "#contact", id: "contact" }].map((item, index) => (
              <a href={item.href} key={item.id} onClick={() => setOpen(false)} style={{ "--menu-index": index } as React.CSSProperties}>
                <span className="micro">0{index + 1}</span>{item.label}<i>↗</i>
              </a>
            ))}
          </nav>
          <div className="mobile-menu-bottom micro">
            <a href="mailto:hello@sreehari.dev">hello@sreehari.dev</a>
            <span>Option {layout.toUpperCase()} — Kerala, India — {time}</span>
          </div>
        </div>
      )}
    </>
  );
}
