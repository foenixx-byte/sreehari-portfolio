export type Project = {
  slug: string;
  title: string;
  year: string;
  kind: string;
  note: string;
  color: string;
  image?: string;
  imageAlt: string;
  description: string;
  stack: string[];
  features: string[];
};



const publicImage = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

export const images = {
  aeroscanCover: publicImage("aeroscan-cover.png"),
  expentraxCover: publicImage("expentrax.png"),
  rasoiCover: publicImage("rasoi-cover.png"),
  hirewaveCover: publicImage("hirewave.png"),
};

export const projects: Project[] = [
  {
    slug: "aeroscan-pro",
    title: "AeroScan Pro",
    year: "2026",
    kind: "AI computer vision app",
    note: "(Personal build)",
    color: "#1a2e3b",
    image: images.aeroscanCover,
    imageAlt: "AeroScan Pro real-time air quality detection interface",
    description:
      "An AI-powered computer vision application that performs real-time indoor air quality scans and particle detection — identifying airborne allergens, mold, dust and pollutants in under 2 seconds.",
    stack: ["Python", "TensorFlow", "Keras", "OpenCV", "Flask", "Kivy", "FPDF2"],
    features: ["10 FPS live camera analysis", "40+ environment classifications", "Automated PDF health reports"],
  },
  {
    slug: "hirewave",
    title: "HireWave",
    year: "2026",
    kind: "Full-stack job portal & ATS",
    note: "(Personal build)",
    color: "#2d1f3d",
    image: images.hirewaveCover,
    imageAlt: "HireWave job portal and applicant tracking system interface",
    description:
      "A full-featured recruitment platform built with Django, supporting end-to-end hiring workflows with role-based access for job seekers, recruiters and administrators — with Stripe payments and smart CV screening.",
    stack: ["Python", "Django 4.x", "SQLite / PostgreSQL", "PyMuPDF", "Stripe API", "JavaScript"],
    features: ["Automated CV keyword matching", "Stripe payment integration", "Role-based dashboards"],
  },
  {
    slug: "expentrax",
    title: "Expentrax",
    year: "2026",
    kind: "Cross-platform finance tracker",
    note: "(Personal build)",
    color: "#1c2f1a",
    image: images.expentraxCover,
    imageAlt: "Expentrax personal finance tracker with analytics dashboard",
    description:
      "A secure offline-first mobile expense tracker with real-time cloud sync, biometric authentication, voice logging, GPS location tagging and interactive spending analytics.",
    stack: ["Flutter", "Dart", "Firebase", "SQLite", "Provider"],
    features: ["Offline-first with Firestore sync", "Biometric security", "Voice expense input"],
  },
  {
    slug: "rasoi",
    title: "Rasoi",
    year: "2026",
    kind: "Restaurant discovery platform",
    note: "(Personal build)",
    color: "#3b1a0f",
    image: images.rasoiCover,
    imageAlt: "Rasoi local food discovery and restaurant management platform",
    description:
      "A full-stack restaurant discovery and vendor management platform connecting local diners with authentic eateries — featuring smart search, owner portals and end-to-end authentication.",
    stack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "Tailwind CSS v4", "Zod"],
    features: ["Real-time dish & cuisine search", "Vendor onboarding portal", "E2E tested with Playwright"],
  },
];

export const education = [
  {
    period: "2026 — Present",
    qualification: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Kalam Technical University, Kerala",
    details:
      "Specializing in software development, data structures, web technologies, and human-computer interaction. Active participant in design and coding clubs.",
    subjects: ["Computer Science", "Web Technologies", "HCI"],
  },
  {
    period: "2023 — 2026",
    qualification: "Diploma Education",
    institution: "State Board of Technical Education",
    details:
      "Computer Science stream with focus on programming fundamentals, mathematics, and design thinking.",
    subjects: ["Computer Science", "Web Technologies"],
  },
];

export const certifications = [
  {
    title: "Google AI Essentials",
    issuer: "Google — Coursera",
    year: "2026",
    category: "AI",
    document: `${import.meta.env.BASE_URL}certificates/google-ai-essentials.pdf`,
  },
  {
    title: "Google Prompting Essentials",
    issuer: "Google — Coursera",
    year: "2026",
    category: "Prompting",
    document: `${import.meta.env.BASE_URL}certificates/google-prompting-essentials.pdf`,
  },
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte — Forage",
    year: "2026",
    category: "Data",
    document: `${import.meta.env.BASE_URL}certificates/deloitte-data-analytics.pdf`,
  },
];

export const services = [
  {
    title: "Websites",
    text: "Modern, responsive sites and portfolios — clean HTML, CSS and thoughtful motion that works on every screen.",
  },
  {
    title: "Full-stack apps",
    text: "End-to-end applications with Django backends, REST APIs, authentication and databases designed around the job.",
  },
  {
    title: "AI integration",
    text: "Practical AI features — from intelligent search to automated pipelines — woven into real-world products.",
  },
  {
    title: "Deployment",
    text: "Shipping to Vercel, Netlify or Cloudflare Pages with clean CI/CD, so your project stays fast and live.",
  },
];

export type LayoutVariant = "a" | "b";

export const tools = [
  "Python",
  "Django",
  "React",
  "HTML",
  "CSS",
  "JavaScript",
  "PostgreSQL /  Mysql",
  "Git",
  "Vercel / Netlify",
  "Antigravity",
];

export type ToolCategory = "Core" | "Backend" | "Frontend" | "Workflow";

export const toolDetails: { name: string; category: ToolCategory; use: string }[] = [
  { name: "Python", category: "Core", use: "Application logic, scripting and automation" },
  { name: "Django", category: "Backend", use: "Full-stack applications and admin workflows" },
  { name: "PostgreSQL", category: "Backend", use: "Relational data modelling and queries" },
  { name: "HTML,CSS", category: "Frontend", use: "Semantic, accessible page structure" },
  { name: "JavaScript", category: "Frontend", use: "Browser interaction and dynamic UI" },
  { name: "React", category: "Frontend", use: "Component-driven interfaces and SPAs" },
  { name: "Git", category: "Workflow", use: "Version control and clean commit history" },
  { name: "GitHub", category: "Workflow", use: "Code review, collaboration and CI/CD" },
  { name: "Vercel,Netlify", category: "Workflow", use: "Front-end deployment and edge functions" },
  { name: "Cloudflare Pages", category: "Workflow", use: "Global CDN deployment and DNS management" },
  { name: "Antigravity,Claude,Codex", category: "Workflow", use: "AI-assisted development and code editing" },
];

export const marqueeWords = ["Python", "Django", "React", "AI", "APIs", "Vercel", "Motion"];
