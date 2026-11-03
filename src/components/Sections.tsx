import { useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { certifications, education, services } from "../data";
import type { LayoutVariant } from "../data";
import { useReducedMotion } from "../hooks";
import Toolkit from "./Toolkit";

export function EducationExperience() {
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0 || !scroller.current) return;
    drag.current = { x: event.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || !scroller.current) return;
    const distance = event.clientX - drag.current.x;
    if (Math.abs(distance) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      scroller.current.classList.add("is-dragging");
      scroller.current.setPointerCapture(event.pointerId);
    }
    if (drag.current.moved) scroller.current.scrollLeft = drag.current.left - distance;
  };
  const endDrag = () => {
    drag.current = null;
    scroller.current?.classList.remove("is-dragging");
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!scroller.current || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    scroller.current.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * Math.min(720, scroller.current.clientWidth * 0.8),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section className="credentials-section" id="education" aria-labelledby="credentials-title">
      <div className="credentials-heading" data-reveal>
        <div>
          <p className="micro credential-eyebrow">(The path so far)</p>
          <h2 id="credentials-title">Education &amp; certifications</h2>
        </div>
      </div>
      <div
        className="credentials-scroller"
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Education and certifications. Scroll horizontally to explore."
        data-lenis-prevent
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div className="credentials-track">
          <section className="education-panel" aria-labelledby="education-title">
            <div className="credential-panel-heading">
              <span className="micro">(01 / Education)</span>
              <h3 id="education-title">Where I learned to build.</h3>
            </div>
            <ol className="education-timeline">
              {education.map((item, index) => (
                <li className={index === 0 ? "education-entry current" : "education-entry"} key={item.period}>
                  <article className="education-card">
                    <p className="micro credential-period">{item.period}</p>
                    <h4>{item.qualification}</h4>
                    <p className="education-institution">{item.institution}</p>
                    <p className="education-description">{item.details}</p>
                    <ul className="education-tags" aria-label="Subjects">
                      {item.subjects.map((subject) => <li key={subject}>{subject}</li>)}
                    </ul>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          <section className="certifications-panel" aria-labelledby="certifications-title">
            <div className="credential-panel-heading">
              <span className="micro">(02 / Certifications)</span>
              <h3 id="certifications-title">Learning beyond the classroom.</h3>
            </div>
            <div className="certification-grid">
              {certifications.map((certificate, index) => (
                <a
                  className="certification-card"
                  href={certificate.document}
                  key={certificate.title}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${certificate.title} certificate, ${certificate.year}`}
                >
                  <div className="certification-card-top">
                    <span className="certification-number micro">0{index + 1}</span>
                    <span className="certification-category micro">{certificate.category}</span>
                  </div>
                  <h4>{certificate.title}</h4>
                  <p>{certificate.issuer}</p>
                  <span className="certification-year micro">{certificate.year}</span>
                  <span className="certification-open micro">View certificate <span aria-hidden="true">↗</span></span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export function Services({ onSelect, variant }: { onSelect: (service: string) => void; variant: LayoutVariant }) {
  return (
    <section className={`services-section ${variant === "b" ? "services-option-b" : ""}`} id="services" aria-labelledby="services-title">
      <div className="section-heading" data-reveal>
        <h2 id="services-title">What I do</h2>
        <a className="text-link micro" href="#contact" onClick={() => onSelect("")}>Start a project <span>→</span></a>
      </div>
      <div className="service-grid">
        {services.map((service, index) => (
          <a
            className="service-card"
            href="#contact"
            key={service.title}
            onClick={() => onSelect(service.title)}
            data-reveal
            data-cursor="Enquire"
            style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
          >
            <span className="service-top micro"><span>0{index + 1}</span><i>↗</i></span>
            <span className="service-content">
              <strong>{service.title}</strong>
              <span>{service.text}</span>
            </span>
          </a>
        ))}
      </div>
      <Toolkit variant={variant} />
    </section>
  );
}

const email = "sreeharip209@gmail.com";

export function Footer({ inquiry, variant }: { inquiry: string; variant: LayoutVariant }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const subject = encodeURIComponent(inquiry ? `${inquiry} project enquiry` : "Project enquiry from your portfolio");
  const mailto = `mailto:${email}?subject=${subject}`;

  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement("textarea");
        field.value = email;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy was not available");
      }
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 2200);
  };

  const bottom = (
    <div className="footer-bottom micro">
      <div className="footer-email">
        <a href={mailto}>{email}</a>
        <button type="button" onClick={copyEmail} aria-live="polite">
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Select email to copy" : "Copy"}
        </button>
      </div>
      <div className="footer-social">
        <a href="https://github.com/foenixx-byte" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/sreehari-p-33b1a1385/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>
    </div>
  );

  const legal = (
    <div className="footer-legal micro">
      <span>©2026 Sreehari</span>
      <span>Designed with purpose. Built with code.</span>
    </div>
  );

  const footerContent = (
    <>
      {bottom}
      {legal}
    </>
  );

  if (variant === "b") {
    return (
      <footer className="site-footer footer-option-b" id="footer" aria-label="Sreehari footer">
        <div className="footer-b-top" data-reveal>
          <div>
            <p className="micro accent">(Sreehari / Full-stack Python & Web developer)</p>
            <p>Clean interfaces, dependable backends and code built around the problem — with a strong eye on performance and user experience.</p>
          </div>
          <nav className="micro" aria-label="Footer navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#education">Education</a>
            <a href="#services">Services</a>
            <a href="#toolkit">Toolkit</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <a className="footer-b-name" href="#top" data-reveal data-cursor="Top" aria-label="PORTFOLIO — back to top">
          PORTFOLIO <span aria-hidden="true">↑</span>
        </a>
        {footerContent}
      </footer>
    );
  }

  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-title">
      <div className="footer-kicker micro" data-reveal>
        <span className="accent">{inquiry ? `(Enquiry / ${inquiry})` : "(Got something in mind?)"}</span>
        <span>Web & Python development</span>
      </div>
      <h2 className="sr-only" id="contact-title">Contact Sreehari</h2>
      <a className="footer-title jelly-control" href={mailto} data-reveal data-cursor="Email" aria-label="Let's talk — email Sreehari">
        LET&apos;S TALK <span>↗</span>
      </a>
      {bottom}
      {legal}
    </footer>
  );
}
