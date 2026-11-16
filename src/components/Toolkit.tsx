import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { toolDetails } from "../data";
import type { LayoutVariant } from "../data";
import { useReducedMotion } from "../hooks";

import icon0 from "../assets/python-svgrepo-com.svg";
import icon1 from "../assets/django-svgrepo-com.svg";
import icon2 from "../assets/html-svgrepo-com.svg";
import icon3 from "../assets/css-3-svgrepo-com.svg";
import icon4 from "../assets/js-official-svgrepo-com.svg";
import icon5 from "../assets/react.svg";
import icon6 from "../assets/git-svgrepo-com.svg";
import icon7 from "../assets/github-logo-svgrepo-com.svg";
import icon8 from "../assets/vercel-light.svg";
import icon9 from "../assets/cloudflare-pages.svg";
import icon10 from "../assets/google-antigravity.svg";
import icon11 from "../assets/claude.svg";
import icon12 from "../assets/codex-openai.svg";
const skillIcons = [[icon0], [icon1], [], [icon2, icon3], [icon4], [icon5], [icon6], [icon7], [icon8], [icon9], [icon10, icon11, icon12]];

type MotionAPI = typeof DeviceMotionEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

type Body = { x: number; y: number; vx: number; vy: number; w: number; h: number };

export default function Toolkit({ variant: _variant }: { variant: LayoutVariant }) {
  const reduced = useReducedMotion();
  const arena = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const drag = useRef<{ index: number; dx: number; dy: number; pointer: number; left: number; top: number; width: number; height: number; time: number } | null>(null);
  const wake = useRef<() => void>(() => {});
  const hoverTime = useRef(0);
  const [motionPermission, setMotionPermission] = useState<'prompt' | 'granted' | 'denied'>(() =>
    typeof DeviceMotionEvent !== 'undefined' && window.isSecureContext && (DeviceMotionEvent as MotionAPI).requestPermission ? 'prompt' : 'granted');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const container = arena.current;
    if (!container || reduced) return;
    let frame = 0, start = 0, last = 0, active = false, quietFrames = 0;
    let width = container.clientWidth, height = container.clientHeight;
    const reset = () => {
      width = container.clientWidth; height = container.clientHeight;
      bodies.current = buttons.current.map((button, i) => {
        const w = button?.offsetWidth ?? 140, h = button?.offsetHeight ?? 44;
        return { x: 12 + ((i * 127) % Math.max(1, width - w - 24)), y: -h - 20, vx: (i % 2 ? 1 : -1) * 0.8, vy: 0, w, h };
      });
      start = 0; quietFrames = 0; wake.current();
    };
    const paint = (now: number) => {
      frame = 0;
      if (!active) return;
      if (!start) start = now;
      const dt = Math.min(2, (now - (last || now)) / 16.67); last = now;
      const previous = bodies.current.map(body => [body.x, body.y]);
      const released = Math.min(bodies.current.length, 1 + Math.floor((now - start) / 80));
      bodies.current.forEach((body, i) => {
        if (i >= released) return;
        if (drag.current?.index !== i) {
          body.vy += 0.72 * dt; body.x += body.vx * dt; body.y += body.vy * dt;
          body.vx *= Math.pow(0.985, dt);
        }
      });
      // Resolve rectangle contacts so labels settle into a readable pile.
      for (let pass = 0; pass < 4; pass++) {
        for (let i = 0; i < released; i++) {
          const a = bodies.current[i];
          for (let j = i + 1; j < released; j++) {
            const b = bodies.current[j];
            const dx = a.x + a.w / 2 - b.x - b.w / 2;
            const dy = a.y + a.h / 2 - b.y - b.h / 2;
            const ox = (a.w + b.w) / 2 + 3 - Math.abs(dx);
            const oy = (a.h + b.h) / 2 + 3 - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;
            const aHeld = drag.current?.index === i, bHeld = drag.current?.index === j;
            const shareA = aHeld ? 0 : bHeld ? 1 : 0.5;
            const shareB = bHeld ? 0 : aHeld ? 1 : 0.5;
            if (oy < ox) {
              const sign = dy < 0 ? -1 : 1;
              a.y += sign * oy * shareA; b.y -= sign * oy * shareB;
              if (!aHeld) a.vy *= 0.25;
              if (!bHeld) b.vy *= 0.25;
            } else {
              const sign = dx < 0 ? -1 : 1;
              a.x += sign * ox * shareA; b.x -= sign * ox * shareB;
              if (!aHeld) a.vx *= -0.3;
              if (!bHeld) b.vx *= -0.3;
            }
          }
          if (a.x < 8 || a.x + a.w > width - 8) a.vx *= -0.5;
          a.x = Math.max(8, Math.min(width - a.w - 8, a.x));
          if (a.y + a.h > height - 10) { a.y = height - a.h - 10; a.vy = Math.abs(a.vy) > 1.5 ? -a.vy * 0.32 : 0; }
        }
      }
      bodies.current.forEach((body, i) => {
        const button = buttons.current[i];
        if (button) { button.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`; button.style.visibility = i < released ? 'visible' : 'hidden'; }
      });
      const moving = bodies.current.some((body, i) => Math.abs(body.x - previous[i][0]) + Math.abs(body.y - previous[i][1]) > 0.12);
      quietFrames = !drag.current && !moving && released === bodies.current.length ? quietFrames + 1 : 0;
      if (quietFrames < 24) frame = requestAnimationFrame(paint);
    };
    wake.current = () => {
      quietFrames = 0;
      if (active && !frame) { last = 0; frame = requestAnimationFrame(paint); }
    };
    reset();
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (active) frame = requestAnimationFrame(paint);
    }, { threshold: 0.15 });
    observer.observe(container);
    const resize = new ResizeObserver(reset); resize.observe(container);
    let lastShake = 0;
    let previousGravity: { x: number; y: number; z: number } | null = null;
    const onMotion = (event: DeviceMotionEvent) => {
      if (!active || document.hidden || drag.current) return;
      let acceleration = event.acceleration;
      if (acceleration?.x == null || acceleration.y == null) {
        const gravity = event.accelerationIncludingGravity;
        if (gravity?.x == null || gravity.y == null || gravity.z == null) return;
        const current = { x: gravity.x, y: gravity.y, z: gravity.z };
        const previous = previousGravity; previousGravity = current;
        if (!previous) return;
        acceleration = { x: current.x - previous.x, y: current.y - previous.y, z: current.z - previous.z };
      }
      const x = acceleration.x ?? 0, y = acceleration.y ?? 0, z = acceleration.z ?? 0;
      const strength = Math.hypot(x, y, z);
      if (strength < 7 || event.timeStamp - lastShake < 120) return;
      lastShake = event.timeStamp;
      const angle = (window.screen.orientation?.angle ?? 0) * Math.PI / 180;
      const horizontal = x * Math.cos(angle) + y * Math.sin(angle);
      bodies.current.forEach((body, index) => {
        if (body.y < 0) return;
        body.vx = Math.max(-10, Math.min(10, horizontal * .6 + (index % 2 ? 2 : -2)));
        body.vy = -Math.min(12, strength * .65);
      });
      wake.current();
    };
    if (motionPermission === 'granted') window.addEventListener('devicemotion', onMotion, { passive: true });
    return () => { active = false; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); window.removeEventListener('devicemotion', onMotion); drag.current = null; wake.current = () => {}; };
  }, [reduced, motionPermission]);

  const enableMotion = async () => {
    try {
      const result = await (DeviceMotionEvent as MotionAPI).requestPermission?.();
      setMotionPermission(result === 'granted' ? 'granted' : 'denied');
    } catch { setMotionPermission('denied'); }
  };
  const hover = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (reduced || event.pointerType !== 'mouse' || event.buttons || drag.current || event.timeStamp - hoverTime.current < 160) return;
    const body = bodies.current[index];
    if (!body) return;
    hoverTime.current = event.timeStamp;
    const rect = event.currentTarget.getBoundingClientRect();
    body.vx = event.clientX < rect.left + rect.width / 2 ? 4 : -4;
    body.vy = -5;
    wake.current();
  };
  const grab = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (reduced || event.button !== 0 || drag.current) return;
    const body = bodies.current[index], rect = arena.current?.getBoundingClientRect();
    if (!body || !rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { index, dx: event.clientX - rect.left - body.x, dy: event.clientY - rect.top - body.y, pointer: event.pointerId, left: rect.left, top: rect.top, width: arena.current!.clientWidth, height: arena.current!.clientHeight, time: event.timeStamp };
    body.vx = 0; body.vy = 0; setSelected(index); wake.current();
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const held = drag.current, container = arena.current;
    if (!held || held.pointer !== event.pointerId || !container) return;
    const body = bodies.current[held.index];
    const x = Math.max(8, Math.min(held.width - body.w - 8, event.clientX - held.left - held.dx));
    const y = Math.max(8, Math.min(held.height - body.h - 10, event.clientY - held.top - held.dy));
    const elapsed = Math.max(8, event.timeStamp - held.time);
    body.vx = Math.max(-12, Math.min(12, (x - body.x) * 16.67 / elapsed));
    body.vy = Math.max(-12, Math.min(12, (y - body.y) * 16.67 / elapsed));
    body.x = x; body.y = y; held.time = event.timeStamp;
    // Update the held button immediately without a render or layout read.
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    wake.current();
  };
  const release = () => {
    if (!drag.current) return;
    const body = bodies.current[drag.current.index];
    if (performance.now() - drag.current.time > 100) { body.vx = 0; body.vy = 0; }
    drag.current = null; wake.current();
  };
  return (
    <div className="skill-playground" id="toolkit">
      <header className="skill-heading">
        <div><p className="micro accent">(Toolkit / hands-on)</p><h3>Serious tools.<br /><em>A little play.</em></h3></div>
        <p>From the first data model to the final browser interaction. A collection of tools I build with — yours to move around.</p>
      </header>
      <div className={`skill-arena ${reduced ? 'is-static' : ''}`} ref={arena} aria-label="Interactive skill playground">
        {toolDetails.map((tool, i) => <button type="button" key={tool.name} ref={node => { buttons.current[i] = node; }} className="skill-pill" aria-pressed={selected === i} aria-describedby="skill-detail" onPointerEnter={event => hover(event, i)} onPointerDown={event => grab(event, i)} onPointerMove={event => { if (drag.current) move(event); else hover(event, i); }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onClick={() => setSelected(i)} onKeyDown={event => {
          if (reduced || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
          event.preventDefault(); const body = bodies.current[i]; if (!body) return;
          body.vx = event.key === 'ArrowLeft' ? -6 : event.key === 'ArrowRight' ? 6 : 0;
          body.vy = event.key === 'ArrowDown' ? 5 : -8; setSelected(i); wake.current();
        }}><span className="skill-pill-icon" aria-hidden="true">{skillIcons[i].length ? skillIcons[i].map(icon => <img key={icon} src={icon} alt="" draggable={false} width="20" height="20" />) : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#336791" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></svg>}</span>{tool.name.split(',').join(' / ')}<span className="skill-pill-grip" aria-hidden="true">⠿</span></button>)}
      </div>
      <div className="skill-caption"><p id="skill-detail" aria-live="polite">{selected === null ? 'Pick a skill to see how I use it.' : `${toolDetails[selected].name} — ${toolDetails[selected].use}`}</p>{!reduced && motionPermission === 'prompt' && <button className="skill-motion-enable" type="button" onClick={enableMotion}>Enable shake</button>}{motionPermission === 'denied' && <span className="micro" role="status">Motion access unavailable. You can still drag the skills.</span>}</div>
    </div>
  );
}
