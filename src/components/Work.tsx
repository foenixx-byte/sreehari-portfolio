import { useEffect, useRef, useState } from "react";
import { projects } from "../data";
import type { LayoutVariant, Project } from "../data";

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="project-details" id={`${project.slug}-details`}>
      <p>{project.description}</p>
      <div>
        <p className="micro accent">(Built with)</p>
        <ul className="project-stack" aria-label="Technology stack">
          {project.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <p className="micro accent">(Key flows)</p>
        <ul className="project-features">
          {project.features.map((item) => <li key={item}>{item}<span>↗</span></li>)}
        </ul>
      </div>
      <a className="text-link" href={`mailto:hello@sreehari.dev?subject=${encodeURIComponent(`A build like ${project.title}`)}`}>
        Discuss a similar build <span>↗</span>
      </a>
    </div>
  );
}

export default function Work({ variant }: { variant: LayoutVariant }) {
  const [active, setActive] = useState(0);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const rows = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const syncHash = () => {
      const slug = window.location.hash.slice(1);
      const index = projects.findIndex((project) => project.slug === slug);
      if (index >= 0) {
        setOpenProject(slug);
        setActive(index);
      } else {
        setOpenProject(null);
      }
    };
    syncHash();
    window.addEventListener("popstate", syncHash);
    window.addEventListener("hashchange", syncHash);
    return () => {
      window.removeEventListener("popstate", syncHash);
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  useEffect(() => {
    if (variant === 'b') return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const center = window.innerHeight * 0.5;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      rows.current.forEach((row, index) => {
        if (!row) return;
        const box = row.getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;
        const nextDistance = Math.abs(box.top + Math.min(box.height, window.innerHeight * 0.6) / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = index;
        }
      });
      if (distance !== Number.POSITIVE_INFINITY) setActive(closest);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [variant]);

  const toggleProject = (slug: string) => {
    // Selecting a project should keep its details visible. Previously clicking
    // the same card a second time collapsed it, which made the selected work
    // appear to disappear.
    const next = slug;
    const index = projects.findIndex((project) => project.slug === slug);
    setOpenProject(next);
    if (index >= 0) setActive(index);
    window.history.pushState(null, "", `#${slug}`);
  };

  return (
    <section className={`work-section ${variant === "b" ? "work-option-b" : ""}`} id="work" aria-labelledby="work-title">
      <div className="section-heading" data-reveal>
        <h2 id="work-title">Selected work <span>(0{projects.length})</span></h2>
        <p className="micro">2025 — 2026</p>
      </div>

      {variant === "a" ? (
        <div className="work-layout">
          <div className="project-list">
            {projects.map((project, index) => {
              const isOpen = openProject === project.slug;
              return (
                <article
                  className={`project-item ${active === index ? "active" : ""} ${isOpen ? "open" : ""}`}
                  id={project.slug}
                  key={project.slug}
                  ref={(node) => {
                    rows.current[index] = node;
                  }}
                  onPointerEnter={() => setActive(index)}
                >
                  <button
                    className="project-toggle"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${project.slug}-details`}
                    onClick={() => toggleProject(project.slug)}
                    onFocus={() => setActive(index)}
                    data-cursor={isOpen ? "Close" : "Open"}
                  >
                    <span className="project-title-row">
                      <span className="project-number micro">0{index + 1}</span>
                      <span className="project-title">{project.title}</span>
                      <span className="project-year micro">{project.year}</span>
                    </span>
                    <span className="project-meta">
                      <span>{project.kind} <small>{project.note}</small></span>
                      <span className="project-link">{isOpen ? "Close details" : "View project"} <i>{isOpen ? "↑" : "→"}</i></span>
                    </span>
                  </button>
                  <div className="project-mobile-image">
                    {project.image ? (
                      <img src={project.image} alt={project.imageAlt} loading="lazy" draggable="false" />
                    ) : (
                      <div className="project-image-placeholder" role="img" aria-label={`${project.title} preview image unavailable`}>
                        <span>{project.title}</span>
                        <small>PROJECT PREVIEW</small>
                      </div>
                    )}
                  </div>
                  {isOpen && <ProjectDetails project={project} />}
                </article>
              );
            })}
          </div>

          <aside className="work-preview" aria-label="Selected project preview">
            <div className="preview-sticky" style={{ "--project-color": projects[active].color } as React.CSSProperties}>
              <div className="preview-meta micro">
                <span>(0{active + 1}) {projects[active].title}</span>
                <span>0{active + 1} / 0{projects.length}</span>
              </div>
              <div className="preview-frame">
                {projects.map((project, index) => (
                  project.image ? (
                    <img
                      className={active === index ? "active" : ""}
                      src={project.image}
                      alt={active === index ? project.imageAlt : ""}
                      aria-hidden={active !== index}
                      key={project.slug}
                      loading="lazy"
                      draggable="false"
                    />
                  ) : (
                    <div className={`project-image-placeholder preview-image-placeholder ${active === index ? "active" : ""}`} key={project.slug} aria-hidden="true">
                      <span>{project.title}</span>
                      <small>PROJECT PREVIEW</small>
                    </div>
                  )
                ))}
                <span className="preview-tag micro">{projects[active].kind}</span>
              </div>
              <div className="preview-progress" aria-hidden="true"><i style={{ width: `${((active + 1) / projects.length) * 100}%` }} /></div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="work-b-grid">
          {projects.map((project, index) => {
            const isOpen = openProject === project.slug;
            return (
              <article
                className={`work-b-card work-b-card-${index + 1} ${isOpen ? "open" : ""}`}
                id={project.slug}
                key={project.slug}
              >
                <button
                  className="work-b-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${project.slug}-details`}
                  onClick={() => toggleProject(project.slug)}
                  data-cursor={isOpen ? "Close" : "Open"}
                >
                  <span className="work-b-media">
                    {project.image ? (
                      <img src={project.image} alt={project.imageAlt} loading={index < 2 ? "eager" : "lazy"} draggable="false" />
                    ) : (
                      <div className="project-image-placeholder" role="img" aria-label={`${project.title} preview image unavailable`}>
                        <span>{project.title}</span>
                        <small>PROJECT PREVIEW</small>
                      </div>
                    )}
                    <span className="work-b-media-meta micro"><span>0{index + 1} / 0{projects.length}</span><span>{project.year}</span></span>
                    <span className="work-b-view micro">{isOpen ? "Close −" : "View +"}</span>
                  </span>
                  <span className="work-b-title-row">
                    <strong>{project.title}</strong>
                    <i>↗</i>
                  </span>
                  <span className="work-b-kind">{project.kind} <small>{project.note}</small></span>
                </button>
                {isOpen && <ProjectDetails project={project} />}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
