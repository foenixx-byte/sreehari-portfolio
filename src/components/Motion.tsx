import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { marqueeWords } from "../data";
import { subscribeToScroll, useReducedMotion } from "../hooks";

export function JellyName() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLHeadingElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const nameLines = ["SREE","HARI"];

  const resetLetters = () => {
    letters.current.forEach((letter) => {
      if (!letter) return;
      letter.style.fontVariationSettings = '"wdth" 70, "wght" 800';
      letter.style.transform = "translate3d(0,0,0) scale(1)";
    });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (reduced || event.pointerType === "touch") return;
    letters.current.forEach((letter) => {
      if (!letter) return;
      const box = letter.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
      const pull = Math.max(0, 1 - distance / 420);
      const eased = pull * pull * (3 - 2 * pull);
      const width = 70 + 55 * eased;
      const weight = 800 - 540 * eased;
      letter.style.fontVariationSettings = `"wdth" ${width.toFixed(1)}, "wght" ${weight.toFixed(0)}`;
      letter.style.transform = `translate3d(0, ${(-10 * eased).toFixed(2)}px, 0) scale(${(1 + eased * 0.025).toFixed(3)}, ${(1 + eased * 0.055).toFixed(3)})`;
    });
  };

  const onPointerDown = () => {
    if (reduced || !root.current) return;
    root.current.animate(
      [
        { transform: "scale(1, 1)" },
        { transform: "scale(1.018, 0.965)", offset: 0.24 },
        { transform: "scale(0.992, 1.018)", offset: 0.5 },
        { transform: "scale(1.005, 0.994)", offset: 0.74 },
        { transform: "scale(1, 1)" },
      ],
      { duration: 720, easing: "cubic-bezier(.22,.8,.25,1)" },
    );
  };

  useEffect(() => {
    if (reduced) {
      resetLetters();
      lines.current.forEach((line) => line?.style.removeProperty("transform"));
      return;
    }

    let lastY = window.scrollY;
    let target = 0;
    let stretch = 0;
    let frame = 0;
    const onScroll = () => {
      const next = window.scrollY;
      target = Math.min(0.085, Math.abs(next - lastY) * 0.0022);
      lastY = next;
    };
    const tick = () => {
      target *= 0.88;
      stretch += (target - stretch) * 0.16;
      lines.current.forEach((line) => {
        if (line) line.style.transform = `scale(${(1 - stretch * 0.28).toFixed(4)}, ${(1 + stretch).toFixed(4)})`;
      });
      frame = requestAnimationFrame(tick);
    };
    const unsubscribeFromScroll = subscribeToScroll(onScroll);
    frame = requestAnimationFrame(tick);
    return () => {
      unsubscribeFromScroll();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <h1
      className="hero-name"
      ref={root}
      onPointerMove={onPointerMove}
      onPointerLeave={resetLetters}
      onPointerDown={onPointerDown}
      aria-label="Sreehari, web and Python developer"
    >
      {nameLines.map((line, lineIndex) => (
        <span
          className={`name-line name-line-${lineIndex + 1}`}
          aria-hidden="true"
          key={line}
          ref={(node) => {
            lines.current[lineIndex] = node;
          }}
        >
          {line.split("").map((letter, letterIndex) => {
            const index = lineIndex * 10 + letterIndex;
            return (
              <span
                className="name-letter"
                key={`${letter}-${letterIndex}`}
                ref={(node) => {
                  letters.current[index] = node;
                }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function SkillsMarquee() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !track.current) return;
    let frame = 0;
    let last = 0;
    let offset = 0;
    let boost = 0;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(850, boost + Math.abs(y - lastY) * 5);
      lastY = y;
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const setWidth = (track.current?.scrollWidth ?? 0) / 4;
      offset += (58 + boost) * dt;
      if (setWidth > 0 && offset >= setWidth) offset %= setWidth;
      if (track.current) track.current.style.transform = `translate3d(${-offset}px,0,0)`;
      boost *= 0.92;
      frame = requestAnimationFrame(tick);
    };
    const unsubscribeFromScroll = subscribeToScroll(onScroll);
    frame = requestAnimationFrame(tick);
    return () => {
      unsubscribeFromScroll();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section className="skills-marquee" aria-label={`Skills: ${marqueeWords.join(", ")}`}>
      <div className="marquee-track" ref={track} aria-hidden="true">
        {Array.from({ length: 4 }, (_, copy) => (
          <div className="marquee-set" key={copy}>
            {marqueeWords.map((word) => (
              <span className="marquee-word" key={`${copy}-${word}`}>
                <span>{word}</span>
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

type StatementWord = { text: string; italic: boolean; accent: boolean };

function parseStatement(value: string) {
  const words: StatementWord[] = [];
  let italic = false;
  let accent = false;
  value.split(/\s+/).filter(Boolean).forEach((raw) => {
    let text = raw;
    if (text.startsWith("*")) {
      italic = true;
      text = text.slice(1);
    }
    if (text.startsWith("_")) {
      accent = true;
      text = text.slice(1);
    }
    const closesItalic = /\*[^\p{L}\p{N}]*$/u.test(text);
    const closesAccent = /_[^\p{L}\p{N}]*$/u.test(text);
    text = text.replace(/[*_](?=[^\p{L}\p{N}]*$)/gu, "");
    if (text) words.push({ text, italic, accent });
    if (closesItalic) italic = false;
    if (closesAccent) accent = false;
  });
  return words;
}

const statement =
  "Hey, I'm *Sreehari*. I turn _ideas into powerful digital experiences_. From intelligent backends to seamless user interfaces, *I build applications* that are _fast_, _scalable_, and made to stand out.";
const statementWords = parseStatement(statement);

export function ScrollStatement() {
  const reduced = useReducedMotion();
  const scene = useRef<HTMLElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduced) {
      words.current.forEach((word) => word?.style.setProperty("opacity", "1"));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!scene.current) return;
      const rect = scene.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const lit = progress * (statementWords.length + 5) - 1.5;
      words.current.forEach((word, index) => {
        if (!word) return;
        const amount = Math.min(1, Math.max(0, lit - index));
        word.style.opacity = String(0.16 + amount * 0.84);
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const unsubscribeFromScroll = subscribeToScroll(requestUpdate);
    window.addEventListener("resize", requestUpdate);
    return () => {
      unsubscribeFromScroll();
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section className="statement-scene" id="about" ref={scene} aria-labelledby="about-title">
      <div className="statement-sticky">
        <p className="micro accent" id="about-title" data-reveal>(Hello)</p>
        <p className="sr-only">{statement.replace(/[*_]/g, "")}</p>
        <p className="statement" aria-hidden="true">
          {statementWords.map((word, index) => (
            <span
              key={`${word.text}-${index}`}
              className={`${word.italic ? "statement-italic " : ""}${word.accent ? "statement-accent" : ""}`}
              ref={(node) => {
                words.current[index] = node;
              }}
            >
              {word.text}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
