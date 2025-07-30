// main api file
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { getAccounts } from './accounts';

export const runtime = 'edge';

const app = new Hono()
  .basePath('/api')
  .route('/accounts', getAccounts); // Note: using '/' instead of '/accounts'

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
