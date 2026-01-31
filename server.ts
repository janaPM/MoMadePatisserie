import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // ============================================
  // Cache & Compression Middleware
  // ============================================
  // Add Cache-Control headers for static assets
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    etag: false,
    setHeaders: (res, path) => {
      // Images and assets: cache for 1 year (versioned by webpack)
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2)$/)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // HTML: cache for 1 hour (allows updates)
      else if (path.match(/\.html$/)) {
        res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
      }
    }
  }));

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  
  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
