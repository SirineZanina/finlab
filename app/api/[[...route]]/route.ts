import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { HTTPException } from 'hono/http-exception';
import { accountsRouter } from './accounts';
import { categoriesRouter } from './categories';
import { transactionsRouter } from './transactions';
import { summaryRouter } from './summary';
import { currenciesRouter } from './currency';
import { countriesRouter } from './country';
import { authRouter } from './auth';

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
  .route('/categories', categoriesRouter)
  .route('/transactions', transactionsRouter)
  .route('/summary', summaryRouter)
  .route('/currencies', currenciesRouter)
  .route('/countries', countriesRouter)
  .route('/auth', authRouter); // Add auth routes

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);    // Add this for update operations
export const DELETE = handle(app); // Add this for delete operations

export type AppType = typeof routes;
