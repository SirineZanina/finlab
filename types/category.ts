import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';

export type Category = {
	id: string;
	name: string;
}

export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>['data'][0];

// TODO: possibly remove this
export type CategoryCount = {
	name: string;
	count: number;
	totalCount: number;
}

