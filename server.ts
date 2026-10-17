import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './api/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

// Vite Middleware for Full-Stack development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production static serving
  app.use((await import('express')).default.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Only listen when running standalone server (not inside Vercel serverless environment)
if (!process.env.VERCEL) {
  httpServer.listen(port, () => {
    console.log(`EduMind.AO Server running on http://localhost:${port}`);
  });
}

export { app, httpServer };
export default app;
