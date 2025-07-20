import { User } from './user';

export type SessionData = {
  user: User | null;
  loading: boolean;
  error?: Error;
};
