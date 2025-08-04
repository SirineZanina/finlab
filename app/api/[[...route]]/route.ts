import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { accountsRouter } from './accounts';
import { HTTPException } from 'hono/http-exception';
import { categoriesRouter } from './categories';

// export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((err, c) => {
  console.error('API Error:', err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({
    error: 'Internal Server Error',
    message: err.message || 'Unknown error occurred'
  }, 500);
});

// Route the accounts endpoints
const routes = app
  .route('/accounts', accountsRouter)
  .route('/categories', categoriesRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);    // Add this for update operations
export const DELETE = handle(app); // Add this for delete operations

export type AppType = typeof routes;
