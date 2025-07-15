import { User } from '../user/user';
import { BusinessIndustry } from './businessIndustry';

export type Business = {
	id: string;
	name: string;
	industry: BusinessIndustry;
	user: User[];

}
