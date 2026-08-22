const http = require('http');
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  let fp = path.join(dist, url === '/' ? 'index.html' : url);

  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    fp = path.join(dist, 'index.html');
  }

  const ext = path.extname(fp);
  const contentType = MIME[ext] || 'application/octet-stream';

  // Set cache headers based on file type
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (url.includes('/assets/') || url.includes('/fonts/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.setHeader('Content-Type', contentType);
  fs.createReadStream(fp).pipe(res);
});

const PORT = 4173;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Preview server running at http://127.0.0.1:${PORT}`);
});
