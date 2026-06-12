import process from 'node:process';

const backendApiBaseUrl =
  process.env.BACKEND_API_BASE_URL ?? 'http://localhost:8080/api';

export const config = {
  rewrites: [
    {
      source: '/api/:path*',
      destination: `${backendApiBaseUrl}/:path*`,
    },
    {
      source: '/(.*)',
      destination: '/index.html',
    },
  ],
};
