#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const backendUrl =
  process.env.BACKEND_API_BASE_URL || 'http://localhost:8080/api';

const config = {
  rewrites: [
    {
      source: '/api/:path*',
      destination: `${backendUrl}/:path*`,
    },
    {
      source: '/(.*)',
      destination: '/index.html',
    },
  ],
};

const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
fs.writeFileSync(vercelJsonPath, JSON.stringify(config, null, 2));

console.log(
  `✓ vercel.json generated with BACKEND_API_BASE_URL=${backendUrl}`
);
