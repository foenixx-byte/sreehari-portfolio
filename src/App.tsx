import { useState } from "react";
import Header from "./components/Header";
import Work from "./components/Work";
import Contact from "./components/Contact";
import { EducationExperience, Footer, Services } from "./components/Sections";
import { JellyName, ScrollStatement, SkillsMarquee } from "./components/Motion";
import { useReducedMotion, useReveals, useSmoothScroll } from "./hooks";
import resumeUrl from "./assets/Sreehari resu.pdf?url";

export default function App() {
  const reduced = useReducedMotion();
  const [inquiry, setInquiry] = useState("");
  const layout: "a" | "b" = "b";
  useSmoothScroll(reduced);
  useReveals(reduced, layout);

  return (
    <>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <Header layout={layout} />
      <main id="top">
        <section className="hero" aria-label="Sreehari portfolio introduction">
          <div className="hero-top micro">
            <span>(Portfolio / ©2026)</span>
            <span>Web & Python developer</span>
            <span>Kerala, India</span>
          </div>
          <div className="hero-name-wrap">
            <JellyName />
          </div>
          <div className="hero-bottom">
            <p className="hero-intro" data-reveal>
              I build modern, responsive web apps with <em>Python at the core</em> — turning ideas into clean, efficient digital experiences that are useful and enjoyable to use.
            </p>
            <div className="hero-actions" data-reveal>
              <a className="outline-button jelly-control" href="#work">View selected work <span>→</span></a>
              <a className="outline-button jelly-control" href={resumeUrl} download="Sreehari-Resume.pdf">
                Download resume <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <SkillsMarquee />
        <Work variant={layout} />
        <EducationExperience />
        <ScrollStatement />
        <Services onSelect={setInquiry} variant={layout} />
        {layout === "b" && <Contact inquiry={inquiry} />}
      </main>
      <Footer inquiry={inquiry} variant={layout} />
    </>
  );
}
