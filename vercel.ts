/// <reference types="node" />

import { deploymentEnv, routes } from '@vercel/config/v1';
import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      '/api/:path*',
      `${deploymentEnv('BACKEND_API_BASE_URL')}/:path*`
    ),
    routes.rewrite('/(.*)', '/index.html'),
  ],
};
