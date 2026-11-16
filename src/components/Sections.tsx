import { useState } from "react";
import { certifications, education, services } from "../data";
import type { LayoutVariant } from "../data";
import Toolkit from "./Toolkit";

export function EducationExperience() {
  return (
    <section className="learning-section" id="education" aria-labelledby="credentials-title">
      <header className="learning-heading">
        <p className="micro accent">(The path so far / 01)</p>
        <h2 id="credentials-title">Always a student.<br /><em>Always building.</em></h2>
        <p>Education &amp; certifications — the foundations behind my work.</p>
      </header>
      <div className="learning-layout">
        <div className="learning-studies">
          <p className="micro learning-label">01 — Formal education</p>
          {education.map((item, index) => (
            <article className="learning-entry" key={item.period}>
              <div className="learning-meta micro"><span>{item.period}</span>{index === 0 && <span className="learning-now">In progress</span>}</div>
              <h3>{item.qualification}</h3>
              <p className="learning-institution">{item.institution}</p>
              <p className="learning-description">{item.details}</p>
              <ul className="learning-tags">{item.subjects.map(subject => <li key={subject}>{subject}</li>)}</ul>
            </article>
          ))}
        </div>
        <aside className="learning-certificates" aria-labelledby="certifications-title">
          <p className="micro learning-label">02 — Independent learning</p>
          <h3 id="certifications-title">Beyond the<br /><em>classroom.</em></h3>
          {certifications.map((certificate, index) => (
            <a className="learning-certificate" key={certificate.title} href={certificate.document} target="_blank" rel="noreferrer" aria-label={`View ${certificate.title} certificate (opens in a new tab)`}>
              <span className="micro learning-certificate-index">0{index + 1}</span>
              <span><span className="micro learning-certificate-meta">{certificate.category} / {certificate.year}</span><strong>{certificate.title}</strong><span className="learning-issuer">{certificate.issuer}</span></span>
              <span className="learning-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
          <p className="micro learning-note">A little more curious, every day.</p>
        </aside>
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
