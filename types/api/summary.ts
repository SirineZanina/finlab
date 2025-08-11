export type FinancialData = {
    income: number | null;
    expenses: number | null;
    remaining: number | null;
};

export type CategoryData = {
	name: string;
	value: bigint;
};

export type ActiveDaysData = {
	date: Date;
	income: number;
	expenses: number;
};
