import { withSession } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { calculatePercentageChange, fillMissingDays } from '@/lib/utils';
import { GetApiVariables } from '@/types/api/common';
import { ActiveDaysData, CategoryData, FinancialData } from '@/types/api/summary';
import { zValidator } from '@hono/zod-validator';
import { Prisma } from '@prisma/client';
import { differenceInDays, parse, subDays } from 'date-fns';
import { Hono } from 'hono';
import z from 'zod';

export const summaryRouter = new Hono<{
  Variables: GetApiVariables;
}>()
  .get('/',
    withSession,
    zValidator('query', z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    async (c) => {
      const businessId: string = c.get('businessId') as string;

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      const { from, to, accountId } = c.req.valid('query');

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, 'yyyy-MM-dd', defaultTo)
        : defaultFrom;

      const endDate = to
        ? parse(to, 'yyyy-MM-dd', defaultTo)
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;

      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        businessId: string,
        startDate: Date,
        endDate: Date
      ): Promise<FinancialData[]> {
        if (accountId) {
          // Query with account filter
          return await prisma.$queryRaw<FinancialData[]>`
            SELECT 
              SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) as income,
              SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) as expenses,
              SUM(t.amount) as remaining
            FROM transactions t
            INNER JOIN accounts a ON t."accountId" = a.id
            WHERE t."accountId" = ${accountId}
              AND a."businessId" = ${businessId}
              AND t.date >= ${startDate}
              AND t.date <= ${endDate}
          `;
        } else {
          // Query without account filter - just filter by business
          return await prisma.$queryRaw<FinancialData[]>`
            SELECT 
              SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) as income,
              SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) as expenses,
              SUM(t.amount) as remaining
            FROM transactions t
            INNER JOIN accounts a ON t."accountId" = a.id
			WHERE
				a."businessId" = ${businessId}
				AND t."date" >= ${startDate}
				AND t."date" <= ${endDate}
				${accountId ? Prisma.sql`AND t."accountId" = ${accountId}` : Prisma.empty}
          `;
        }
      }

      const [currentPeriodRaw] = await fetchFinancialData(
        businessId,
        startDate,
        endDate,
      );

      const [lastPeriodRaw] = await fetchFinancialData(
        businessId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      // Convert BigInt to Number
      const currentPeriod = {
        income: Number(currentPeriodRaw.income),
        expenses: Number(currentPeriodRaw.expenses),
        remaining: Number(currentPeriodRaw.remaining),
      };

	  console.log('Raw database values:', {
        income: currentPeriodRaw.income,      // Should be 100000
        expenses: currentPeriodRaw.expenses,   // Should be 0
        remaining: currentPeriodRaw.remaining  // Should be 100000
      });

	  console.log('After conversion:', {
        income: Number(currentPeriodRaw.income) / 1000,      // Should be 100
        expenses: Number(currentPeriodRaw.expenses) / 1000,   // Should be 0
        remaining: Number(currentPeriodRaw.remaining) / 1000  // Should be 100
      });

      const lastPeriod = {
        income: Number(lastPeriodRaw.income),
        expenses: Number(lastPeriodRaw.expenses),
        remaining: Number(lastPeriodRaw.remaining),
      };

      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income,
      );
	  console.log('Income:', currentPeriod.income);
	  console.log('Last Income:', lastPeriod.income);

	  console.log('Income Change:', incomeChange);

      const expensesChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses,
      );

	  console.log('Expenses:', currentPeriod.expenses);
	  console.log('Last Expenses:', lastPeriod.expenses);
	  console.log('Expenses Change:', expensesChange);

      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining,
      );

	  console.log('Remaining:', currentPeriod.remaining);
	  console.log('Last Remaining:', lastPeriod.remaining);
	  console.log('Remaining Change:', remainingChange);

	  const categories = await prisma.$queryRaw<CategoryData[]>`
		SELECT 
			c.name,
			SUM(t.amount) as value
		FROM categories c
		INNER JOIN transactions t ON c."id" = t."categoryId"
		INNER JOIN accounts a ON t."accountId" = a."id"
		WHERE
			a."businessId" = ${businessId}
			AND t."date" >= ${startDate}
			AND t."date" <= ${endDate}
			${accountId ? Prisma.sql`AND t."accountId" = ${accountId}` : Prisma.empty}
			AND t."amount" < 0
		GROUP BY c.name
		ORDER BY 
			SUM(ABS(t.amount)) DESC
		`;

	  const topCategories = categories.slice(0, 3).map(category => ({
	    name: category.name,
	    value: Math.abs(Number(category.value)),
	  }));

	  const otherCategories = categories.slice(3).map(category => ({
        name: category.name,
        value: Math.abs(Number(category.value)),
	  }));

	  const otherSum = otherCategories
	  	.reduce((sum, current) => sum + current.value, 0);

      const finalCategories = topCategories;
	  if (otherCategories.length > 0) {
        finalCategories.push({
          name: 'Other',
          value: otherSum,
        });
	  }

	  const activeDaysQuery = await prisma.$queryRaw<ActiveDaysData[]>`
		SELECT 
			t.date,
			SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) as income,
			SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) as expenses
		FROM transactions t
		INNER JOIN accounts a ON t."accountId" = a."id"
		INNER JOIN categories c ON t."categoryId" = c.id
		WHERE
			a."businessId" = ${businessId}
			AND t.date >= ${startDate}
			AND t.date <= ${endDate}
			${accountId ? Prisma.sql`AND t."accountId" = ${accountId}` : Prisma.empty}
		GROUP BY t.date
		ORDER BY t.date`;

      const activeDays = activeDaysQuery.map(day => ({
        date: day.date,
        income: Number(day.income),
        expenses: Number(day.expenses),
	  }));

	  const days = fillMissingDays(
        activeDays,
        startDate,
        endDate,
	  );

	  return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
		  remainingChange,
		  incomeAmount: currentPeriod.income,
		  incomeChange,
		  expensesAmount: currentPeriod.expenses,
		  expensesChange,
		  categories: finalCategories,
		  days,
        }
	  });
    },
  );
