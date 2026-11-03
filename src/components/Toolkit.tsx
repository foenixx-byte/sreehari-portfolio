import { useState } from "react";
import { toolDetails, tools } from "../data";
import type { LayoutVariant, ToolCategory } from "../data";

const categories: ("All" | ToolCategory)[] = ["All", "Core", "Backend", "Frontend", "Workflow"];

export default function Toolkit({ variant }: { variant: LayoutVariant }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  if (variant === "a") {
    return (
      <div className="toolkit" id="toolkit" data-reveal>
        <p className="micro accent">(Everyday toolkit)</p>
        <ul aria-label="Development tools and skills">
          {tools.map((tool) => <li key={tool}>{tool}</li>)}
        </ul>
      </div>
    );
  }

  const visibleTools = category === "All" ? toolDetails : toolDetails.filter((tool) => tool.category === category);

  return (
    <div className="toolkit-option-b" id="toolkit">
      <div className="toolkit-b-heading" data-reveal>
        <div>
          <p className="micro accent">(Toolkit)</p>
          <h3>The tools behind the build.</h3>
        </div>
        <p>From the first data model to the final browser interaction, these are the tools I use to put a project together.</p>
      </div>
      <div className="toolkit-filter" role="group" aria-label="Filter toolkit by category" data-reveal>
        <div>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "active" : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="micro" aria-live="polite">{String(visibleTools.length).padStart(2, "0")} tools</span>
      </div>
      <ul className="toolkit-b-list" aria-label={`${category} tools`}>
        {visibleTools.map((tool, index) => (
          <li key={tool.name} style={{ "--tool-index": index } as React.CSSProperties}>
            <span className="micro">{tool.category}</span>
            <strong>{tool.name}</strong>
            <p>{tool.use}</p>
            <span className="toolkit-b-number micro">{String(index + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
