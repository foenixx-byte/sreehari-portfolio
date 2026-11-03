import { defineConfig, type PreviewServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'https://localhost:5173,https://127.0.0.1:5173,https://foenixx-byte.github.io').split(',').map((origin) => origin.trim()).filter(Boolean);

const corsConfig = {
  origin: allowedOrigins,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Production CSP — strict, no unsafe-inline for scripts
const productionCSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

// Dev CSP — relaxed to allow Vite HMR inline scripts and websocket
const devCSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' ws: wss:",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ');

const securityHeaders = (dev: boolean) => ({
  'Content-Security-Policy': dev ? devCSP : productionCSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...(dev ? {} : { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }),
});

function addSecurityHeaders() {
  const applyHeaders = (res: { setHeader: (name: string, value: string) => void }, dev: boolean) => {
    for (const [name, value] of Object.entries(securityHeaders(dev))) {
      res.setHeader(name, value);
    }
  };

  return {
    name: 'security-headers',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((_req, res, next) => {
        // In dev, never redirect http→https (breaks local dev)
        applyHeaders(res, true);
        next();
      });
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] === 'http') {
          const host = req.headers.host ?? 'localhost';
          res.writeHead(301, { Location: `https://${host}${req.url ?? '/'}` });
          res.end();
          return;
        }
        applyHeaders(res, false);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), addSecurityHeaders()],
  base: '/sreehari-portfolio/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: corsConfig,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    cors: corsConfig,
  },
});
